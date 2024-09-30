Organizations have started adopting [Amazon Workspaces](https://docs.aws.amazon.com/workspaces/latest/adminguide/amazon-workspaces.html) as virtual cloud based desktop as a solution (DAAS) to replace their existing traditional desktop solution to shift the cost and effort of maintaining laptops and desktops to a cloud pay-as-you-go model. Organizations using Amazon Workspaces would need support of these managed services to monitor their workspaces environment for Day 2 operations. A cloud based managed open source monitoring solution such as Amazon Managed Service for Prometheus and Amazon Managed Grafana helps IT teams to quickly setup and operate a monitoring solution to save cost. Monitoring CPU, memory, network, or disk activity from Amazon Workspace eliminates guesswork while troubleshooting Amazon Workspaces environment.

A managed monitoring solution on your Amazon Workspaces environments yields following organizational benefits:

* Service desk staff can quickly identify and drill down to Amazon Workspace issues that need investigation without guesswork by leveraging managed monitoring services such as Amazon Managed Service for Prometheus and Amazon Managed Grafana
* Service desks staffs can investigate Amazon Workspace issues after the event using the historical data in Amazon Managed Service for Prometheus
* Eliminates long calls that waste time questioning business users on Amazon Workspaces issues


In this blog post, we will set up Amazon Managed Service for Prometheus, Amazon Managed Grafana, and a Prometheus server on Amazon Elastic Compute Cloud (EC2) to provide a monitoring solution for Amazon Workspaces.  We will automate the deployment of Prometheus agents on any new Amazon Workspace using Active Directory Group Policy Objects (GPO).

**Solution Architecture**

The following diagram demonstrates the solution to monitor your Amazon Workspaces environment using AWS native managed services such as Amazon Managed Service for Prometheus and Amazon Managed Grafana. This solution will deploy a Prometheus server on Amazon Elastic Compute Cloud (EC2) instance which polls prometheus agents on your Amazon Workspace periodically and remote writes metrics to Amazon Managed Service for Prometheus. We will be using Amazon Managed Grafana to query and visualize metrics on your Amazon Workspaces infrastructure.
![Screenshot](prometheus.drawio-dotted.drawio.png)