import {
    expect as expectCDK,
    haveResource,
    SynthUtils,
    anything,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
const CdkStack_module = require("../lib/cdk-stack");

test("Example empty YAML file", () => {
    expect(
      CdkStack_module.convertYamlToJson("empty.yaml", "../test/yaml_test_files/")
    ).toStrictEqual(undefined);
  });
  
  test("YAML file with one key", () => {
    expect(
      CdkStack_module.convertYamlToJson(
        "one_key.yaml",
        "../test/yaml_test_files/"
      )
    ).toStrictEqual({ searchTags: { key: "env", value: "production" } });
  });
  
  test("YAML file with multiple keys", () => {
    expect(
      CdkStack_module.convertYamlToJson(
        "multi_key.yaml",
        "../test/yaml_test_files/"
      )
    ).toStrictEqual({
      searchTags: {
        key: "env",
        value: "production",
      },
      AMP: {
        remote_write: "https://www.amazon.com",
      },
    });
  });
  
  test("YAML file with arrays", () => {
    expect(
      CdkStack_module.convertYamlToJson("array.yaml", "../test/yaml_test_files/")
    ).toStrictEqual({
      searchTags: {
        key: "env",
        value: "production",
        metrics: [
          {
            name: "FreeStorageSpace",
            statistics: ["Sum"],
          },
          {
            name: "ClusterStatus.green",
            statistics: ["Minimum"],
          },
        ],
      },
    });
  });
  