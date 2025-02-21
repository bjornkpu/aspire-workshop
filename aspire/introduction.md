# Introducing .NET Aspire

.NET Aspire is an opinionated, cloud ready stack for building observable, production ready, distributed applications. .NET Aspire is delivered through a collection of NuGet packages that handle specific cloud-native concerns. Cloud-native apps often consist of small, interconnected pieces or microservices rather than a single, monolithic code base. Cloud-native apps generally consume a large number of services, such as databases, messaging, and caching.

.NET Aspire is designed to improve the experience of building .NET cloud-native apps. It provides a consistent, opinionated set of tools and patterns that help you build and run distributed apps. .NET Aspire is designed to help you with:

**Orchestration**: .NET Aspire provides features for running and connecting multi-project applications and their dependencies for local development environments.

**Components**: .NET Aspire components are NuGet packages for commonly used services, such as Redis or Postgres, with standardized interfaces ensuring they connect consistently and seamlessly with your app.

**Tooling**: .NET Aspire comes with project templates and tooling experiences for Visual Studio and the dotnet CLI help you create and interact with .NET Aspire apps.

## Installing .NET Aspire

To check your version of .NET Aspire run:
```shell
dotnet new list aspire
```
Create a starter app
```shell
dotnet new aspire-starter
```
or an empty starter app
```shell
dotnet new aspire
```

This is already wired up correctly.

## Adding .NET Aspire
If you already have a solution you can add Aspire to your project by adding two projects to the solution.

To create the apphost run
```shell
dotnet new aspire-apphost
```
And the service defaults
```shell
dotnet new aspire-servicedefaults
```
We can now add the two projects in our solution.

Let's take a look at the two projects

### AppHost
The Aspire AppHost project is responsible for running our system during local development. Please note the words "system" and "local development". Aspire won't be going to production. Instead, it is here to help us orchestrate running our cloud-native distributed system. From APIs, to background services, databases and caches, Aspire will be responsible for running everything we need, and it will make sure that our services can talk to each other.

As of now it only has the following 2 lines of code, but we will be adding many more.

```shell
var builder = DistributedApplication.CreateBuilder(args);
builder.Build().Run();
```

### ServiceDefaults
The Aspire Service Defaults project is responsible for wiring up services, resilience and telemetry for our projects. It is being referred to by our main projects and the `AddServiceDefaults` and the `MapDefaultEndpoints` methods are used to do all the wiring for us.

## Wiring .NET Aspire up
To wire .NET Aspire up, first we need to refer ServiceDefaults to the main API project.

Once that's done we can add the `AddServiceDefaults` call in the Program.cs:
```shell
builder.AddServiceDefaults();

```

Then we can add the Aspire endpoints by calling the `MapDefaultEndpoints` method under the Swagger calls:
```shell
app.MapDefaultEndpoints();
```

With all that now done we can wire up the API project to run through Aspire's AppHost project.

To do that we need the following inside AppHost's Program.cs:
```shell
var builder = DistributedApplication.CreateBuilder(args);
builder.AddProject<Projects.Api>("api");
builder.Build().Run();
```
This will enable us to run the Api when the AppHost is started.

### Project diagram
To help visualize the relationship between the app host project and the resources it describes, consider the following diagram:
![app-host-resource-diagram](/img/app-host-resource-diagram.png)
