import {
  expect as expectCDK,
  haveResource,
  SynthUtils,
  anything,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";

const CdkStack_module = require("../lib/cdk-stack");

test("Lambda Created", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");

  expectCDK(stack).to(haveResource("AWS::Lambda::Function"));
});

test("S3 Bucket Created", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");

  expectCDK(stack).to(haveResource("AWS::S3::Bucket"));
});

test("Firehose Created", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  expectCDK(stack).to(haveResource("AWS::KinesisFirehose::DeliveryStream"));
});

test("Lambda Function Name", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      FunctionName: "KinesisMessageHandler",
    })
  );
});

test("Lambda has environment variables", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  expectCDK(stack).to(
    haveResource("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          PROMETHEUS_REMOTE_WRITE_URL: anything(),
          PROMETHEUS_REGION: anything(),
        },
      },
    })
  );
});

test("Snapshot passes", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot({
    Parameters: expect.anything(),
    Resources: {
      KinesisFirehoseStream145246AA: {
        Properties: expect.anything()
      },
      KinesisStreamFunctionBDADDE8E: {
        Properties: expect.anything()
      }
    }
  });
});