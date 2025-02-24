# Create the .NET Aspire template

Run the following command to create a new Aspire project with Redis cache:
```shell
dotnet new aspire-starter --use-redis-cache --output AspireSample
```
This will generate the `AspireSample` project. Open the solution in your IDE to begin.

## Examine the Solution Structure
The solution contains **four projects**:
- **API**
- **Web**
- **AppHost**
- **ServiceDefaults**

Take a moment to review these projects and their dependencies:
- **API** and **Web** depend on **ServiceDefaults**.
- **AppHost** does not depend on any project.

Now, let's dive deeper into the individual projects.

## Service Defaults Project
The **ServiceDefaults** project provides extension methods that define reasonable defaults for our projects.
Key highlights:
- Configures **OpenTelemetry** with exporters.
- Provides **health check** configurations.

These pre-configured extension methods simplify setting up core features for the API and Web projects.

## Program.cs Files in API and Web Projects
Review the `Program.cs` files in both the **API** and **Web** projects. You'll notice they utilize the methods provided by **ServiceDefaults**.
For example:
``` csharp
builder.AddServiceDefaults();
app.MapDefaultEndpoints();
```
In the Web project, you'll also see that service discovery is used to communicate with backend services. Instead of using an IP and port combination, it uses a Fully Qualified Domain Name (FQDN):
``` csharp
client.BaseAddress = new("https+http://apiservice");
```
> **Note:**
> FQDNs are provided by the **Aspire AppHost**.


## Understanding the AppHost Project
The **AppHost** project serves as the orchestrator for the solution. Now, let's configure **Redis**, the **API**, and the **Web**.
### Adding Redis
Add Redis as an integration (formerly called components) to the AppHost:
``` csharp
var cache = builder.AddRedis("cache");
```
Key points:
- The Redis container is defined here.
- The name `"cache"` is significant because other parts of the solution will reference this name.

### Adding the API Project
Add the API project to the AppHost using **Source Generation**:
``` csharp
var apiService = builder.AddProject<Projects.AspireSample_ApiService>("apiservice");
```
Key points:
- The API project is added with the name `"apiservice"`. This name will also be referenced later.

### Adding the Web Project
Finally, configure the Web project and set dependencies on Redis and the API service:
``` csharp
builder.AddProject<Projects.AspireSample_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(cache)          // Dependency on Redis
    .WaitFor(cache)                // Wait for Redis health check
    .WithReference(apiService)     // Dependency on API service
    .WaitFor(apiService);          // Wait for API service health check
```
Key points:
- You are establishing dependencies between resources using their variables (`cache`, `apiService`).
- The Web project waits for the health checks of Redis and the API service before starting.

## Understanding the Duality of AppHost and Project Dependencies

In Aspire, there is a distinction between hosting resources (done in the AppHost) and consuming those resources (done in dependent projects like Web or API). Each side requires specific packages and methods to function correctly.

---

### Hosting Resources in the AppHost

The **AppHost** project is responsible for orchestrating and hosting containers or services. For example:

- When hosting **Redis**, you need the NuGet package:
```shell
Aspire.Hosting.Redis
```
And you configure Redis in the AppHost like this:
```csharp
var cache = builder.AddRedis("cache");
```

- Similarly, for **SQL Server**, you would host and define the database container with:
```shell
Aspire.Hosting.SqlServer
```
Example setup:
```csharp
var sql = builder.AddSqlServer("sqlserver")
                   .AddDatabase("sqldatabase");
```

---

### Consuming Hosted Resources in Projects

Dependent projects like **Web** or **API** consume resources hosted by the AppHost. To achieve this, use consumer-specific packages and methods.

- For **Redis**, the consuming project requires:
```shell
Aspire.StackExchange.Redis.OutputCaching
```
And you configure it like this:
```csharp
builder.AddRedisOutputCache("cache");
```

- For **SQL Server**, the consuming project needs:
```shell
Aspire.Microsoft.EntityFrameworkCore.SqlServer
```
Example usage:
```csharp
builder.AddSqlServerDbContext<DbContext>("sqldatabase");
```

---

### Key Takeaways

1. **AppHost** is responsible for hosting the resources (e.g., Redis container, SQL Server).
2. Dependent projects such as **Web** or **API** consume those hosted resources using their own appropriate configuration.
3. Each hosting-consumption pair often uses separate NuGet packages, such as:
    - Hosting **Redis**: `Aspire.Hosting.Redis`
    - Consuming **Redis**: `Aspire.StackExchange.Redis.OutputCaching`
    - Hosting **SQL Server**: `Aspire.Hosting.SqlServer`
    - Consuming **SQL Server**: `Aspire.Microsoft.EntityFrameworkCore.SqlServer`

