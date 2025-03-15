# Opentelemetry

.NET's OpenTelemetry implementation stands out due to its unique integration with the framework's built-in observability features. Instead of providing separate APIs, OpenTelemetry in .NET leverages the framework's native instrumentation capabilities for logging, metrics, and traces through three main components:

- [Microsoft.Extensions.Logging.ILogger\<TCategoryName\>](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.logging.ilogger-1?view=net-9.0-pp) for logging
- [System.Diagnostics.Metrics.Meter for metrics](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.metrics.meter?view=net-9.0) for metrics
- [System.Diagnostics.ActivitySource](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activitysource?view=net-9.0) and [System.Diagnostics.Activity](https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activity?view=net-9.0) for tracing

## Packages
