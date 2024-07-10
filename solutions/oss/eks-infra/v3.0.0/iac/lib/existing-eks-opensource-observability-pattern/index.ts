import { ImportClusterProvider, utils } from '@aws-quickstart/eks-blueprints';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { GrafanaOperatorSecretAddon } from './grafanaoperatorsecretaddon';
import {AmpAddOnProps, CustomAmpAddOn} from "./customampaddon";
import * as amp from 'aws-cdk-lib/aws-aps';
import { ObservabilityBuilder } from '@aws-quickstart/eks-blueprints';
import * as cdk from "aws-cdk-lib";
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AmpClient, TagResourceCommand } from "@aws-sdk/client-amp";
import * as regionInfo from 'aws-cdk-lib/region-info';

export default class ExistingEksOpenSourceobservabilityPattern {
    async buildAsync(scope: cdk.App, _id: string) {
        const clusterName = process.env.EKS_CLUSTER_NAME || "";
        const stackId = `aws-observability-solution-eks-infra-${clusterName.replace("_", "-")}`;

        const account = process.env.COA_ACCOUNT_ID! || process.env.CDK_DEFAULT_ACCOUNT!;
        const region = process.env.COA_AWS_REGION! || process.env.CDK_DEFAULT_REGION!;

        const amgEndpointUrl = process.env.AMG_ENDPOINT || "";

        const ampWorkspaceArn = process.env.AMP_WS_ARN || "";

        validateInput(account, region, clusterName, amgEndpointUrl, ampWorkspaceArn)

        const sdkCluster = await blueprints.describeCluster(clusterName, region); // get cluster information using EKS APIs
        const vpcId = sdkCluster.resourcesVpcConfig?.vpcId;

        const ampEndpoint = getAmpWorkspaceEndpointFromArn(ampWorkspaceArn);

        const clusterRoleName = "EKS_Obs_" + clusterName;
        const clusterRoleArn = `arn:aws:iam::${account}:role/${clusterRoleName}`;

        /**
         * Assumes the supplied role is registered in the target cluster for kubectl access.
         */
        const importClusterProvider = new ImportClusterProvider({
            clusterName: sdkCluster.name!,
            version: eks.KubernetesVersion.of(sdkCluster.version!),
            clusterEndpoint: sdkCluster.endpoint,
            openIdConnectProvider: blueprints.getResource(context =>
                new blueprints.LookupOpenIdConnectProvider(sdkCluster.identity!.oidc!.issuer!).provide(context)),
            clusterCertificateAuthorityData: sdkCluster.certificateAuthority?.data,
            kubectlRoleArn: clusterRoleArn,
            clusterSecurityGroupId: sdkCluster.resourcesVpcConfig?.clusterSecurityGroupId
        });

        // All Grafana Dashboard URLs from `cdk.json` if present
        const fluxRepository: blueprints.FluxGitRepo = utils.valueFromContext(scope, "fluxRepository", undefined);
        fluxRepository.values!.AMG_AWS_REGION = region;
        fluxRepository.values!.AMP_ENDPOINT_URL = ampEndpoint;
        fluxRepository.values!.AMG_ENDPOINT_URL = amgEndpointUrl;

        const ampAddOnProps: AmpAddOnProps = {
            ampPrometheusEndpoint: ampEndpoint,
            ampRules: {
                ampWorkspaceArn: ampWorkspaceArn,
                ruleFilePaths: [
                    __dirname + '/../common/resources/amp-config/alerting-rules.yaml',
                    __dirname + '/../common/resources/amp-config/recording-rules.yaml',
                    __dirname + '/../common/resources/amp-config/apiserver/recording-rules.yaml'
                ]
            },
            nameSuffix: clusterName
        };

        Reflect.defineMetadata("ordered", true, blueprints.addons.GrafanaOperatorAddon);

        const cwAgentConfig: blueprints.Values = {
            "agent": {
                "config": {
                    "logs": {
                        "metrics_collected": {
                            "application_signals": {},
                            "kubernetes": {}
                        }
                    },
                    "traces": {
                        "traces_collected": {}
                    }
                }
            },
        }

        const CloudWatchInsightsAddOnProps: blueprints.CloudWatchInsightsAddOnProps = {
            customCloudWatchAgentConfig: cwAgentConfig,
        }

        const addOns: Array<blueprints.ClusterAddOn> = [
            new blueprints.AwsLoadBalancerControllerAddOn(),
            new blueprints.CertManagerAddOn(),
            new blueprints.ExternalsSecretsAddOn(),
            new CustomAmpAddOn(ampAddOnProps),
            new blueprints.GrafanaOperatorAddon(),
            new blueprints.KubeStateMetricsAddOn(),
            new blueprints.MetricsServerAddOn(),
            new blueprints.PrometheusNodeExporterAddOn(),
            new blueprints.FluxCDAddOn({ "repositories": [fluxRepository] }),
            new blueprints.CloudWatchInsights(CloudWatchInsightsAddOnProps),
            new GrafanaOperatorSecretAddon(),
        ];

        const obs = ObservabilityBuilder.builder()
            .addOns(...addOns)
            .account(account)
            .region(region)
            .version('auto')
            .clusterProvider(importClusterProvider)
            .resourceProvider(blueprints.GlobalResources.Vpc, new blueprints.VpcProvider(vpcId)) // this is required with import cluster provider
            .build(scope, stackId);

        const stack = obs.getClusterInfo().cluster.stack;

        if (!sdkCluster.identity?.oidc) {
            new iam.OpenIdConnectProvider(stack, 'OIDCProvider', {
                url: sdkCluster.identity!.oidc!.issuer!,
                clientIds: ['sts.amazonaws.com'],
            });
        }

        const clusterRole = new iam.Role(stack, 'ClusterAdminRole', {
            assumedBy: new iam.CompositePrincipal(
                new iam.ServicePrincipal("eks.amazonaws.com"),
                new iam.AccountPrincipal(account).withConditions(
                    { StringLike: { 'aws:PrincipalArn':  "arn:aws:iam::" + account + ":role/aws-observability-solutio-*" } }
                ),
            ),
            roleName: clusterRoleName,
            description: 'Deployed by AWS Managed OSS EKS Infrastructure Observability Solution'
        });

        new eks.CfnAccessEntry(stack, 'MyCfnAccessEntry', {
            clusterName: clusterName,
            principalArn: clusterRole.roleArn,
            accessPolicies: [{
                accessScope: {
                    type: 'cluster',
                },
                policyArn: 'arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy',
            }],
            type: 'STANDARD',
            username: clusterRole.roleArn,
        });

        const scraper = new amp.CfnScraper(obs, 'CfnScraper', {
            alias: 'poseidon-scraper-existing-eks-oso-pattern_' + clusterName,
            destination: {
                ampConfiguration: {
                    workspaceArn: ampWorkspaceArn
                },
            },
            scrapeConfiguration: {
                configurationBlob:
                    blueprints.utils.readYamlDocument(__dirname + '/../common/resources/scraper_config.yaml')
                        .replace("{{CLUSTER_NAME}}", clusterName)
                        .replace("{{VERSION_NUMBER}}", utils.valueFromContext(scope, "solutionVersion", "2.0.0"))
            },
            source: {
                eksConfiguration: {
                    clusterArn: sdkCluster.arn!,
                    subnetIds: sdkCluster.resourcesVpcConfig?.subnetIds!.slice(0,2)!,
                    securityGroupIds: [sdkCluster.resourcesVpcConfig?.clusterSecurityGroupId!],
                },
            },
        });

        scraper.node.addDependency(obs)

        const versionNumber = utils.valueFromContext(scope, "solutionVersion", "2.0.0")

        cdk.Tags.of(stack)
            .add('o11y-eks-infra', "v-" + versionNumber);

        // Tag existing AMP workspace with version number
        const ampClient = new AmpClient();
        const tagInput = {
            resourceArn: ampWorkspaceArn,
            tags: {
                "o11y-eks-infra":"v-" + versionNumber,
            },
        };
        await ampClient.send(new TagResourceCommand(tagInput));
    }
}

function validateInput(account: string, region: string, clusterName: string, amgEndpoint: string, ampArn: string) {
    if (!account || !region || !clusterName || !amgEndpoint || !ampArn) {
        throw new Error("Missing required input parameters. Account, region, cluster name, AMG endpoint, AMP" +
            " workspace ARN are all required.");
    }

    const validRegions = regionInfo.RegionInfo.regions.map(r => r.name);
    if (!validRegions.includes(region)) {
        throw new Error("Region must be valid.");
    }

    if (!amgEndpoint.startsWith("https://")) {
        throw new Error("Invalid AMG endpoint. It should start with \"https://\"");
    } else if (!amgEndpoint.endsWith(".amazonaws.com")) {
        throw new Error("Invalid AMG endpoint. It should end with \".amazonaws.com\"");
    }

    const ampArnParts = ampArn.split(':');
    if (ampArnParts.length !== 6) {
        throw new Error("Invalid AMP ARN format.");
    } else if (ampArnParts[2] !== "aps") {
        throw new Error("Invalid AMP workspace ARN format. It should start with \"arn:aws:aps:\"");
    } else if (!ampArnParts[5].includes("workspace/ws-")) {
        throw new Error("Invalid AMP workspace ARN format. It should end with workspace/ws-abcd1234-abcd-1234-abcd-abcd1234abcd");
    }
}

function getAmpWorkspaceEndpointFromArn(arn: string): string {
    const arnParts = arn.split(':');

    const ampRegion = arnParts[3];
    const ampWorkspaceId = arnParts[5].split('/')[1];

    return `https://aps-workspaces.${ampRegion}.amazonaws.com/workspaces/${ampWorkspaceId}`;
}
