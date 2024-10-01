import {
  Template,
} from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";

const CdkStack_module = require("../lib/cdk-stack");

test("Lambda Created", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");

  Template.fromStack(stack).hasResource("AWS::Lambda::Function", {});
});

test("S3 Bucket Created", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");

  Template.fromStack(stack).hasResource("AWS::S3::Bucket", {});
});

test("Firehose Created", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  Template.fromStack(stack).hasResource("AWS::KinesisFirehose::DeliveryStream", {});
});

test("Lambda Function Name", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  Template.fromStack(stack).hasResourceProperties("AWS::Lambda::Function", {
      FunctionName: "KinesisMessageHandler",
  });
});

test("Lambda has environment variables", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  Template.fromStack(stack).hasResourceProperties("AWS::Lambda::Function", {
      Environment: {
        Variables: {
          PROMETHEUS_REMOTE_WRITE_URL: "https://aps-workspaces.us-east-2.amazonaws.com/workspaces/{workspace}/api/v1/remote_write",
          PROMETHEUS_REGION: "REGION",
        },
      },
    });
});

test("Snapshot passes", () => {
  const app = new cdk.App();
  const stack = new CdkStack_module.CdkStack(app, "MyTestStack");
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot({
    Parameters: expect.anything(),
    Resources: {
      DeliveryStreamF6D5572D: {
        Properties: expect.anything()
      },
      KinesisStreamFunctionBDADDE8E: {
        Properties: expect.anything()
      }
    }
  });
});
