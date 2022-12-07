import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as destinations from "@aws-cdk/aws-kinesisfirehose-destinations";

import {
  DeliveryStream,
  LambdaFunctionProcessor,
} from "@aws-cdk/aws-kinesisfirehose";
import * as lambda from "@aws-cdk/aws-lambda";
import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs";
import * as iam from "@aws-cdk/aws-iam";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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

    const lambdaProcessor = new LambdaFunctionProcessor(lambdaFunction, {
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
    new DeliveryStream(
      this,
      data.Kinesis_Firehose?.delivery_stream_name ?? "Delivery Stream",
      {
        destinations: [destination],
      }
    );
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
