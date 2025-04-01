# Note:

This package contains the changes related to subnet monitoring stack to monitor the free IPs in the subnet. This package does the following:

1. Creates a lambda to monitor the free ips on the subnets, and emit metrics about the number of free IPs.
2. Creates a cloudwatch dashboard to view the free IPs in the subnet.
3. Creates a an alarm if the free IPs drops below the subnet.

# How to deploy:
1. Replace the subnet ids you want to monitor in the `lib/vpc_monitoring_stack.ts` and the frequency at which you want to monitor the free IPs.
2. `npm install`
3. `cdk bootstrap`
4. `cdk deploy --all`

# How to monitor:
Once deployed the above stack should have created a cloudwatch dashboard which can be used for monitoring the free IPs in the subnets for the account. There is also a cloudwatch alarm that is created which gets triggered when the IP threshold is breached.


# How to check logs for the lambda execution:
The logs for the lambda can be found in the Cloudwatch log group `/aws/lambda/VpcMonitoringStackSubnet` which can be used for debugging issues with the lambda.

# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

 [Link to Recipe](https://aws-observability.github.io/observability-best-practices/recipes/recipes/amg-subnet-free-ip-monitoring/)