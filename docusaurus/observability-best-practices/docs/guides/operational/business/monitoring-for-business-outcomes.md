# Why should you do observability?

See [Developing an Observability Strategy](https://www.youtube.com/watch?v=Ub3ATriFapQ) on YouTube

## What really matters?

Everything that you do at work should align to your organization's mission. All of us that are employed work to fulfill our organization's mission and towards its vision. At Amazon, our mission states that:

> Amazon strives to be Earth’s most customer-centric company, Earth’s best employer, and Earth’s safest place to work.

— [About Amazon](https://www.aboutamazon.com/about-us)

In IT, every project, deployment, security measure or optimization should work towards a business outcome. It seems obvious, but you should not do anything that does not add value to the business. As ITIL puts it:

> Every change should deliver business value.

— ITIL Service Transition, AXELOS, 2011, page 44.  
— See [Change Management in the Cloud AWS Whitepaper](https://docs.aws.amazon.com/whitepapers/latest/change-management-in-the-cloud/change-management-in-the-cloud.html)

Mission and business value are important because they should inform everything that you do. There are many benefits to observability, these include:

- Better availability
- More reliability
- Understanding of application health and performance
- Better collaboration
- Proactive detection of issues
- Increase customer satisfaction
- Reduce time to market
- Reduce operational costs
- Automation

All of these benefits have one thing in common, they all deliver business value, either directly to the customer or indrectly to the organization. When thinking about observability, everything should come back to thinking about whether or not your application is delivering business value.

This means that observability should be measuring things that contribute towards delivering business value, focusing on business outcomes and when they are at risk: you should think about what your customers want and what they need.

## Where do I start?

Now that you know what matters, you need to think about what you need to measure. At Amazon, we start with the customer and work backwards from their needs:

> We are internally driven to improve our services, adding benefits and features, before we have to. We lower prices and increase value for customers before we have to. We invent before we have to.

— Jeff Bezos, [2012 Shareholder Letter](https://s2.q4cdn.com/299287126/files/doc_financials/annual/2012-Shareholder-Letter.pdf)

Let's take a simple example, using an e-commerce site. First, think about what you want as a customer when you are buying products online, it may not be the same for everyone, but you probably care about things like:

- Delivery
- Price
- Security
- Page Speed
- Search (can you find the product you are looking for?)

Once you know what your customers care about, you can start to measure them and how they affect your business outcomes. Page speed directly impacts your conversion rate and search engine ranking. A 2017 study showed that more than half (53%) of mobile users abandon a page if it takes more than 3 seconds to load. There are of course, many studies that show the importance of page speed, and it is an obvious metric to measure, but you need to measure it and take action because it has a measureable impact on conversion and you can use that data to make improvements.

## Working backwards

You cannot be expected to know everything that you customers care about. If you are reading this, you are probably in a technical role. You need to talk to the stakeholders in your organisation, this isn't always easy, but it is vital to ensuring that you are measuring what's important. 

Let's continue with the e-commerce example. This time, consider search: it may be obvious that customers need to be able to search for a product in order to buy it, but did you know that according to a [Forrester Research report](https://www.forrester.com/report/MustHave+eCommerce+Features/-/E-RES89561), 43% of visitors navigate immediately to the search box and searches are 2-3 times more likely to convert compared to non-searchers. Search is really important, it has to work well and you need to monitor it - maybe you discover that particular searches are yeilding no results and that you need to move from naive pattern matching to natural language processing. This is an example of monitoring for a business outcome and then acting to improve the customer experience.

At Amazon:

> We strive to deeply understand customers and work backwards from their pain points to rapidly develop innovations that create meaningful solutions in their lives.

— Daniel Slater - Worldwide Lead, Culture of Innovation, AWS in [Elements of Amazon’s Day 1 Culture](https://aws.amazon.com/executive-insights/content/how-amazon-defines-and-operationalizes-a-day-1-culture/)

We start with the customer and work backwards from their needs. This isn't the only approach to success in business, but it is a good approach to observability. Work with stakeholders to understand what's important to your customers and then work backwards from there.

As an added benefit, if you collect metrics that are important to your customers and stakeholders, you can visualize these in near real-time dashboards and avoid having to create reports or answer questions such as "how long is it taking to load the landing page?" or "how much is it costing to run the website?" - stakeholders and executives should be able to self serve this information.

These are the kind of high level metrics that **really matter** for your application and they are also almost always the best indicator that there is an issue. For example: an alert indicating that there are fewer orders than you would normally expect in a given time period tells you that there is probably an issue that is impacting customers; an alert indicating that a volume on a server is nearly full or that you have a high number of 5xx errors for a particular service may be something that requires fixing, but you still have to understand customer impact and then prioritize accordingly - this can take time.

Issues that impact customers are easy to identify when you are measuring these high level business metrics. These metrics are the **what** is happening. Other metrics and other forms of observability such as tracing and logs are the **why** is this happening, which will lead you to what you can do to fix it or improve it.

## What to observe

Now you have an idea of what matters to your customers, you can identify Key Performance Indicators (KPIs). These are your high level metrics that will tell you if business outcomes are at risk. You also need to gather information from many different sources that may impact those KPIs, this is where you need to start thinking about metrics that could impact those KPIs. As was discussed earlier, the number of 5xx errors, does not indicate impact, but it could have an effect on your KPIs. Work your way backwards from what will impact business outcomes to things that may impact business outcomes. 

Once you know what you need to collect, you need to identify the sources of information that will provide you with the metrics you can use to measure KPIs and related metrics that may impact those KPIs. This is the basis of what you observe.

This data is likely to come from Metrics, Logs and Traces. Once you have this data, you can use it to alert when outcomes are at risk.

You can then evaluate the impact and attempt to rectify the issue. Almost always, this data will tell you that there’s a problem, before an isolated technical metric (such as cpu or memory) does.

You can use observability reactively to fix an issue impacting business outcomes or you can use the data proactively to do something like improve your customer's search experience.

## Conclusion

Whilst CPU, RAM, Disk Space and other technical metrics are important for scaling, performance, capacity and cost – they don’t really tell you how your application is doing and don’t give any insight in to customer experience.

Your customers are what’s important and it’s their experience that you should be monitoring.

That’s why you should work backwards from your customers’ requirements, working with your stakeholders and establish KPIs and metrics that matter.
