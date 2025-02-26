# Messaging

We want to add an `order` service to our application. For this we need the hosting service in the `AppHost`, and the client in the producer and consumer projects.

::: info
Currently the Hosting and Client nuget packages to aspire that supports emulator is in preview, this is to be merged into `DotNET 9.2.0`.

This means that for now we have a couple of options:
- Add the preview nuget feed to our solution and upgrade projects to match
- Connect to an existing Azure Service Bus
- Let Aspire use our AZ credentials to provision a Service Bus
- Use a messaging integration that is already here.

I choose to use [RabbitMQ](https://www.rabbitmq.com/), but the same setup applies to [Azure Service Bus](https://learn.microsoft.com/en-us/dotnet/aspire/messaging/azure-service-bus-integration) when this is available in `9.2`.
:::

## Hosting integration
To access these types and APIs for expressing them, add the `Aspire.Hosting.RabbitMQ` NuGet package in the app host project.
```shell
dotnet add package Aspire.Hosting.RabbitMQ
```

In your app host project, call `AddRabbitMQ` to add and return a RabbitMQ Server resource builder.
```csharp
var rabbitmq = builder.AddRabbitMQ("messaging")
    .WithManagementPlugin();
```



## Client integration - Producer
To get started with the client integration, install the `Aspire.RabbitMQ.Client` NuGet package in the client-consuming project, that is, the project for the application that uses the Message Bus client. For us, this is the `AspireShop.BasketService` project. Since this is a sample project using .NET 8 we need to clamp the version to 8.2.

```shell
dotnet add package Aspire.RabbitMQ.Client --version 8.2
```
In the `Program.cs` file of the `BasketService`, Add the RabbitMQClient

```csharp
builder.AddRabbitMQClient(connectionName: "messaging");
```

Then retrieve the IConnection instance using dependency injection in our `BasketService` class.

```csharp
public class BasketService(
    IBasketRepository repository, 
    ILogger<BasketService> logger, 
    IConnection connection
    ) : Basket.BasketBase
{
    // ...
}
```
And insert the code to publish a message in the checkout logic.

```csharp
// Checkout logic would be implemented here
var channel = connection.CreateModel();
string queueName = "order";
try
{
    channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
    var body = Encoding.UTF8.GetBytes($"New order with Id {order.Id} for {buyerId}");
    channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: null, body: body);
}
finally
{
    channel?.Close();
    channel?.Dispose();
}
```
## Client integration - Consumer

Let's add a new worker project, add it to the solution, and install the client package.
Since the `AppHost` is using .NET 8, we are too.

```csharp
dotnet new worker -o AspireShop.OrderService -f net8.0
dotnet sln AspireShop.sln add AspireShop.OrderService/AspireShop.OrderService.csproj
dotnet add package Aspire.RabbitMQ.Client
```

Add a reference to `ServiceDefaults` and add the following code in the `Program.cs`

```csharp
builder.AddServiceDefaults();

builder.AddRabbitMQClient(connectionName: "messaging");
```

Now in the `Worker.cs` file, add the consuming code

```csharp
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace AspireShop.OrderService;

public class Worker(ILogger<Worker> logger, IConnection connection) : BackgroundService
{
    private IModel? _channel;
    
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Initializing RabbitMQ Consumer");

        var queueName = "order";

        _channel = connection.CreateModel();
        _channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

        // Create a consumer
        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            // Handle the message
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            logger.LogInformation("Received message: {Message}", message);

            // Acknowledge the message
            _channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
        };

        // Handle consumer errors
        consumer.Shutdown += (model, ea) =>
        {
            logger.LogError("Consumer shutdown: {Reason}", ea.ReplyText);
        };

        consumer.Registered += (model, ea) =>
        {
            logger.LogInformation("Consumer registered");
        };

        // Start consuming
        _channel.BasicConsume(queue: queueName,
            autoAck: false,
            consumer: consumer);
        return Task.CompletedTask;
    }
    public override Task StopAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Stopping RabbitMQ Consumer");

        _channel?.Close();
        connection?.Close();

        return base.StopAsync(stoppingToken);
    }
    public override void Dispose()
    {
        _channel?.Dispose();
        connection?.Dispose();
        base.Dispose();
    }
}


```


## Wire it all together

The last thing we need to do is to register and reference all the new projects together.

First add a reference to the `OrderService` from The `AppHost`.

In the `Program.cs` of the `AppHost` add the following:

```csharp
var basketService = builder.AddProject<Projects.AspireShop_BasketService>("basketservice")
    .WithReference(basketCache)
    .WaitFor(basketCache)
    .WithReference(rabbitmq)
    .WaitFor(rabbitmq);

var orderService = builder.AddProject<Projects.AspireShop_OrderService>("orderservice")
    .WithReference(rabbitmq)
    .WaitFor(rabbitmq);
```


Now you can run the `AppHost` again and see out bus being created.

## Testing the message bus

With the App running you can access the Management UI for RabbitMQ from the Resources list in the Aspire Dashboard.

The RabbitMQ server resource includes default credentials with a username of `guest` and randomly generated `password`. You can find this password in the environment variables section of the RabbitMQ resource details.

Try to add some items to the cart in the frontend UI and check out. This should post a message through the bus and the `OrderService` should consume the message.


---

This concludes our session.