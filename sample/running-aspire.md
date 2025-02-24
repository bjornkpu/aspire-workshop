# Running .NET Aspire
To run our API through .NET Aspire, all we need to do is run the AppHost project.

::: warning Remember we have to use Podman!
> .NET Aspire projects are designed to run in containers. You can use either Docker Desktop or Podman as your container runtime. Docker Desktop is the most common container runtime. Podman is an open-source daemonless alternative to Docker, that can build and run Open Container Initiative (OCI) containers. If your host environment has both Docker and Podman installed, .NET Aspire defaults to using Docker. You can instruct .NET Aspire to use Podman instead, by setting the `DOTNET_ASPIRE_CONTAINER_RUNTIME` environment variable to `podman`.
:::

We can ether run this in a terminal (windows):
```shell
[System.Environment]::SetEnvironmentVariable("DOTNET_ASPIRE_CONTAINER_RUNTIME", "podman", "User")
```
of just add the environment variable int he `https` profile.
```json
"https": {
  ...
  "environmentVariables": {
   ...
    "DOTNET_ASPIRE_CONTAINER_RUNTIME": "podman"
  }
}
```

Simply using your IDE or `dotnet run`.

I am running the profile `https` using the `launchSettings` in run mode.

## The Dashboard
The first thing that pops up when we run the AppHost is the Aspire Dashboard. The Dashboard is not .NET specific, and it is built to "understand" OpenTelemetry. .NET is already deeply orchestrated with OpenTelemetry. Let's take a look at some data.

## Resources
The resources page contains all the resources that are part of our distributes system.

![Resources](/img/resources.png)

## Console
The console page allows us to see the console logs of any application that exposes them. For now, we can only see our application's logs.

![Console](/img/console.png)


## Structured
The structured page allows us to see the structured logs of our apps. This includes scopes and spans.

![Structured](/img/structured.png)


## Traces
The Traces page provides a detailed view of distributed system operations, visualizing spans and their relationships. It allows you to trace requests across services in your application, giving insights into service dependencies, execution flow, and performance bottlenecks.

![Structured](/img/traces.png)

## Metrics
The metrics pages allows us to visualize metrics that our application is exposing, such as active connections, request duration and more.

![Metrics](/img/metrics.png)


