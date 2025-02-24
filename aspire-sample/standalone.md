# Standalone Aspire dashboard

View telemetry from any app in the Aspire dashboard. The dashboard supports running standalone, and apps configured with an OpenTelemetry SDK can send it data.

This sample is a .NET console app that downloads data from NuGet. The app sends telemetry to the Aspire dashboard which is viewed in the dashboard telemetry UI.

Open the solution at
```shell
aspire-samples/samples/StandaloneDashboard/StandaloneDashboard.sln
```

## Start Aspire dashboard
The following command starts the Aspire dashboard in a container:
```shell
podman run --rm -it -p 18888:18888 -p 4317:18889 -d --name aspire-dashboard mcr.microsoft.com/dotnet/nightly/aspire-dashboard:latest
```
The docker command:
- Starts a container from the `mcr.microsoft.com/dotnet/nightly/aspire-dashboard` image.
- The container has two ports:
  - Port `4317` receives OpenTelemetry data from apps. Apps send data using [OpenTelemetry Protocol (OTLP)](https://opentelemetry.io/docs/specs/otlp/).
  - Port `18888` has the dashboard UI. Navigate to http://localhost:18888 in the browser to view the dashboard.

## Login to the Aspire dashboard

Data displayed in the dashboard can be sensitive. By default, the dashboard is secured with authentication that requires a token to login.

When the dashboard is run from a standalone container the login token is printed to the container logs. After copying the highlighted token into the login page, select the *Login* button.

![aspire-login](/img/aspire-login.png)

Now, take a look in the `Program.cs`. Does the `ConfigureOpenTelemetry`-method look familiar?

It's the same configuration from the `ServiceDefaults` project we have seen before.

We can see the in the `launchSettings` that we provide the OTEL endpoint to our dashboard.

Try running the `ConsoleApp` project, and see the telemetry coming in to the dashboard.

---

We can see in the traces that the program does two requests. Once to `https://api.nuget.org/v3/index.json` to find the URI for the package "SearchQueryService/3.5.0". Then once to `https://azuresearch-usnc.nuget.org/query?skip=Redacted&take=Redacted` for the default top 10.

Let's take a look at how traces helps us here.

In the method `DownloadTopPackagesAsync` we have a default `rowCount` and we use an `ILogger` implementation, that by default supports structured logs. What does this mean?

```csharp
private async Task DownloadTopPackagesAsync(CancellationToken cancellationToken, int rowCount = 10)
  {
      // ...
      logger.LogInformation("Getting top {PackageCount} packages: {SearchUrl}", rowCount, searchServiceUri);
      // ...
  }
```

While the input ro this `logger.LogInformation()` looks like a string, it is actually a `StructuredMessageTemplate`. This means we can filter our structured logs on the `PackageCount` parameter.

In the Structured logs page in the Aspire Dashboard, show logs from all resources and add the filter `PackageCount == 10`.

Now we only see the logs from when this is true. Imagine this being a `UserId`, `ReportId`, or `MessageId`.

---

Stop the Aspire Dashboard container and continue to the last sample.