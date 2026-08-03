# What is Reachability Analyzer?

Reachability Analyzer is a configuration analysis tool in Amazon VPC that enables you to perform connectivity testing between a source and destination resource. It analyzes your network configuration to determine if a path exists without sending any packets.

When the destination is reachable, it shows the hop-by-hop virtual network path. When the destination is not reachable, it identifies the blocking component (security group, NACL, route table, load balancer, etc.).

Think of it as: "Can A reach B? If not, what's blocking it?"


## How It Works

Reachability Analyzer builds a model of your network configuration, then checks for reachability based on that model. It does not send packets or analyze the data plane — purely static config analysis.

**Step 1.** Create a Path: specify source, destination, protocol, and port.

**Step 2.** Run Analysis: Reachability Analyzer evaluates all config (security groups, NACLs, route tables, etc.)

**Step 3.** View Results:
- Reachable → hop-by-hop path displayed
- Not Reachable → blocking component identified


## Supported Resources

**Source and Destination:**
- EC2 Instances
- Internet Gateways
- Network Interfaces
- Transit Gateways
- Transit Gateway Attachments
- Virtual Private Gateways
- VPC Endpoint Services
- VPC Endpoints
- VPC Peering Connections
- IP Addresses (destination only)

**Intermediate Components (include/exclude from analysis):**
- Load Balancers
- NAT Gateways
- AWS Network Firewall
- Transit Gateways
- Transit Gateway Attachments
- VPC Peering Connections


## Path Components (can appear in results)


## Pricing

| Dimension | Price |
|-----------|-------|
| Per analysis run | Charged per analysis (see VPC Pricing → Network Analysis tab) |


## Conclusion

Reachability Analyzer provides instant, packet-free connectivity testing by analyzing your VPC network configuration. It enables organizations to:

- **Troubleshoot Connectivity:** "Why can't my EC2 instance reach the database?" — Reachability Analyzer shows which security group, NACL, or route table is blocking.
- **Verify Intended Connectivity:** After setting up a new VPC architecture, confirm that expected paths exist before deploying applications.
- **Automate Verification:** Use CloudFormation or CLI to run analyses in CI/CD pipelines — catch misconfigurations before they reach production.
- **Post-Change Validation:** After modifying security groups, route tables, or NACLs, verify that existing connectivity isn't broken.
- **Cross-Account Analysis:** With AWS Organizations, analyze paths across accounts (delegated administrator can create paths across owner/participant subnets).


## Resources

- [What is Reachability Analyzer?](https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html)
- [How It Works](https://docs.aws.amazon.com/vpc/latest/reachability/how-reachability-analyzer-works.html)
- [Getting Started (Console)](https://docs.aws.amazon.com/vpc/latest/reachability/getting-started.html)
- [Getting Started (CLI)](https://docs.aws.amazon.com/vpc/latest/reachability/getting-started-cli.html)
