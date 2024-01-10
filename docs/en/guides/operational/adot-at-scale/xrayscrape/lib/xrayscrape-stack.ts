import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elb from "aws-cdk-lib/aws-elasticloadbalancingv2"
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as go from '@aws-cdk/aws-lambda-go-alpha';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import * as targets from "aws-cdk-lib/aws-events-targets"



export class XrayscrapeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Create execution roles for lambda and ecs
    const lambdaExecutionRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSXrayReadOnlyAccess"),
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
      ]
    })

    const fargateExecutionRole = new iam.Role(this, "FargateExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AmazonECSTaskExecutionRolePolicy"),
      ]
    })

    //Create custom adot colllector image with xray receiver
    const image = new DockerImageAsset(this, "ADOTCollectorImage", {
      directory: "image",
    })

    //Create cluster to run the fargate task on.
    const cluster = new ecs.Cluster(this, "Cluster", {
      clusterName: "xrayscrape-cluster",
    })

    //Create ECS ADOT fargate task definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
      memoryLimitMiB: 512,
      cpu: 256,
      executionRole: fargateExecutionRole,   
    })

    taskDefinition.addContainer('adot_collector', {
      image: ecs.ContainerImage.fromRegistry(image.imageUri),
      logging: new ecs.AwsLogDriver({ streamPrefix: "xrayscrape" }),
      portMappings: [{ 
        containerPort: 4317,
        protocol: ecs.Protocol.TCP,
      },
      {
        containerPort: 2000,
        protocol: ecs.Protocol.UDP,
      },
      {
        containerPort: 13133,
        protocol: ecs.Protocol.TCP,
      }
    ]
    })

    //Create security group for the service
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      vpc: cluster.vpc,
      allowAllOutbound: true,
    })
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.udp(2000))
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(4317))
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(13133))

    //Create fargate service for adot-collector
    const service = new ecs.FargateService(this, "XrayScrapeService", {
      cluster,
      taskDefinition,
      serviceName: 'adot-collector',
      desiredCount: 1,
      securityGroups: [securityGroup],
    })

    //Create NLB with listener directed at fargate service
    const nlb = new elb.NetworkLoadBalancer(this, "NLB", {
      vpc: cluster.vpc,
      internetFacing: true,
    })

    //Explicitly create lb target for UDP since service default is TCP
    const lbTarget = service.loadBalancerTarget({
      containerPort: 2000,
      containerName: "adot_collector",
      protocol: ecs.Protocol.UDP,
    })

    const targetGroupXray = new elb.NetworkTargetGroup(this, "TargetGroupUDP", {
      port: 2000,
      protocol: elb.Protocol.UDP,
      targets: [lbTarget],
      vpc: cluster.vpc,
    })
    targetGroupXray.configureHealthCheck({
      port: "4317",
      protocol: elb.Protocol.TCP,
      interval: cdk.Duration.seconds(60),
    })

    const targetGroupOTLP = new elb.NetworkTargetGroup(this, "TargetGroupTCP", {
      port: 4317,
      protocol: elb.Protocol.TCP,
      targets: [service],
      vpc: cluster.vpc,
    })
    targetGroupOTLP.configureHealthCheck({
      port: "4317",
      protocol: elb.Protocol.TCP,
      interval: cdk.Duration.seconds(60),
    })

    nlb.addListener("ListenerUDP", {
      port: 2000,
      protocol: elb.Protocol.UDP,
      defaultTargetGroups: [targetGroupXray],
    })
    nlb.addListener("ListenerTCP", {
      port: 4317,
      protocol: elb.Protocol.TCP,
      defaultTargetGroups: [targetGroupOTLP],
    })

    const goFunction = new go.GoFunction(this, 'handler', {
      entry: 'go-lambda',
      role: lambdaExecutionRole,
      environment: {['OTEL_COLLECTOR_HOST']: nlb.loadBalancerDnsName, ['OTEL_SERVICE_NAME']: "xrayscrape-lambda"},
      timeout: cdk.Duration.seconds(10),
    })

    new Rule(this, 'ScheduleRule', {
      schedule: Schedule.rate(cdk.Duration.minutes(1)),
      targets: [new targets.LambdaFunction(goFunction)],
     });

  }
}
