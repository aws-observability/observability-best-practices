# Telemetry

Telemetry is all about how the signals are collected from various sources,
including your own app and infrastructure and routed to destinations where
they are consumed:

![telemetry concept](images/telemetry.png)

Let's further dive into the concepts introduced in above figure.

## Sources

We consider sources as something where signals come from. There are two
types of sources:

1. Things under your control, that is, the application source code, via instrumentation.
1. Everything else you may use, such as managed services, not under your (direct) control.
   These types of sources are typically provided by AWS, exposing signals via an API.

## Agents

In order to transpor signals from the sources to the destinations, you need
some sort of intermediary we call agent. These agents receive or pull signals 
from the sources and, typically via configuration, determine where signals 
shoud go, optionally supporting filtering and aggregation.

!!! question "Agents? Routing? Shipping? Ingesting?"
    There are many terms out there people use to refer to the process of
    getting the signals from sources to destinations including routing,
    shipping, aggregation, ingesting etc. and while they may mean slightly 
    different things, we will use them here interchangeably. Canonically, 
	we will refer to those intermediary transport components as agents.

## Destinations

Where signals end up, for consumption. No matter if you want to store signals
for later consumption, if you want to dashboard them, set an alert if a certain
condition is true, or correlate signals. All of those components that serve
you as the end-user are destinations.
