import { Construct } from 'constructs';
import {
  Stack, App, aws_s3 as s3, aws_kinesisfirehose as kinesisfirehose, aws_lambda as lambda, aws_iam as iam} from 'aws-cdk-lib'

import * as alpha_kinesisfirehose from '@aws-cdk/aws-kinesisfirehose-alpha'
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations-alpha';

import * as cdk from 'aws-cdk-lib';
import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs";
export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const INPUT_YAML_FILE = "config.yaml"; 

    const data = convertYamlToJson(INPUT_YAML_FILE, "/../../") as any;

    const lambdaFunction = new lambda.Function(this, "KinesisStreamFunction", {
      code: lambda.Code.fromAsset("../lambda"),
      handler: "main",
      functionName: "KinesisMessageHandler",
      runtime: lambda.Runtime.GO_1_X,
      environment: {
        PROMETHEUS_REMOTE_WRITE_URL: data.AMP.remote_write_url,
        PROMETHEUS_REGION: data.AMP.region,
      },
    });

    lambdaFunction.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonPrometheusRemoteWriteAccess"
      )
    );

    const lambdaProcessor = new alpha_kinesisfirehose.LambdaFunctionProcessor(lambdaFunction, {
      bufferInterval: cdk.Duration.minutes(1),
      bufferSize: cdk.Size.mebibytes(3),
      retries: 5,
    });

    const bucket = new s3.Bucket(this, data.S3?.s3_bucket_name ?? "Bucket", {
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    const destination = new destinations.S3Bucket(bucket, {
      processor: lambdaProcessor,
      s3Backup: {
        bucket: bucket,
      },
    });

    new alpha_kinesisfirehose.DeliveryStream(this, 'Delivery Stream', {
      destinations: [destination],
    });

    // new kinesisfirehose.CfnDeliveryStream(
    //   this,
    //   data.Kinesis_Firehose?.delivery_stream_name ?? "Delivery Stream",
    //   {
    //     kinesisfirehose.destinations: [destination],
    //   },
      
    // );
    
  }
}

export const convertYamlToJson = (
  inputFileName: string,
  filePath: string,
  encoding = "utf-8"
) => {
  try {
    // loads the yaml file from config.yaml in the root of the repo
    const json_data = yaml.load(
      fs.readFileSync(path.join(__dirname, filePath + inputFileName), encoding)
    );
    return json_data;
  } catch (e) {
    console.log("Error parsing YAML File.");
    throw new Error(e as any);
  }
};
