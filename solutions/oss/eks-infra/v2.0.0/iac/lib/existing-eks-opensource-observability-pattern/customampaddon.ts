import 'source-map-support/register';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { Construct } from 'constructs';
import { readYamlDocument } from '@aws-quickstart/eks-blueprints/dist/utils';
import * as amp from 'aws-cdk-lib/aws-aps';
import { CfnRuleGroupsNamespace } from "aws-cdk-lib/aws-aps";
import { ICluster } from "aws-cdk-lib/aws-eks";

export interface AmpRules {
    /**
     * AMP workspace ARN.
     */
    ampWorkspaceArn: string;

    /**
     * Paths of the files listing the AMP rules.
     */
    ruleFilePaths: string[];
}

/**
 * Configuration options for add-on.
 */
export interface AmpAddOnProps {
    /**
     * Remote Write URL of the AMP Workspace to be used for setting up remote write.
     *  Format : https://aps-workspaces.<region>.amazonaws.com/workspaces/<ws-workspaceid>/",
     */
    ampPrometheusEndpoint: string;
    /**
     * Modes supported : `deployment`, `daemonset`, `statefulSet`, and `sidecar`
     * @default deployment
     */
    deploymentMode?: DeploymentMode;
    /**
     * Namespace to deploy the ADOT Collector for AMP.
     * @default default
     */
    namespace?: string;
    /**
     * Name for deployment of the ADOT Collector for AMP.
     * @default 'adot-collector-amp'
     */
    name?: string;
    /**
     * Enable "apiserver" job in the Prometheus configuration of the default OpenTelemetryCollector.
     * @default false
     */
    enableAPIServerJob?: boolean;
    /**
     * AMP rules providing AMP workspace ARN and paths to files encoding recording and/or alerting rules following the same format as a rules file in standalone Prometheus.
     * This parameter is optional and if not provided, no rules will be applied.
     */
    ampRules?: AmpRules;
    /**
     * An alternative ApsScraper if you need further customisation.
     * If you need to configure rules, please do not use the rule_files field like in standalone Prometheus, but rather use the ampRules parameter.
     * If not provided, the default will be used.
     */
    apsScraper?: amp.CfnScraper;
}

export const enum DeploymentMode {
    DEPLOYMENT = 'deployment',
}

/**
 * Defaults options for the add-on
 */
const defaultProps = {
    deploymentMode: DeploymentMode.DEPLOYMENT,
    name: 'aps-scraper-amp',
    namespace: 'default',
    enableAPIserverJob: true
};


export class CustomAmpAddOn implements blueprints.ClusterAddOn {
    readonly ampAddOnProps: AmpAddOnProps;

    constructor(props: AmpAddOnProps) {
        this.ampAddOnProps = { ...defaultProps, ...props };
    }
    deploy(clusterInfo: blueprints.ClusterInfo): void | Promise<Construct> {
        const cluster = clusterInfo.cluster;

        const ampRules = this.ampAddOnProps.ampRules;
        if (ampRules !== undefined) {
            this.configureRules(cluster, ampRules.ruleFilePaths, ampRules.ampWorkspaceArn);
        }
    }

    private configureRules(cluster: ICluster, ruleFilePaths: string[], ampWorkspaceArn: string): CfnRuleGroupsNamespace[] {
        const ruleGroupsNamespaces: CfnRuleGroupsNamespace[] = [];

        if (ruleFilePaths.length == 0) {
            throw new Error("No paths defined for AMP rules");
        }

        ruleFilePaths.map((ruleFilePath, index) => {
            const ruleGroupsNamespace = new CfnRuleGroupsNamespace(cluster, "AmpRulesConfigurator-" + index, {
                data: readYamlDocument(ruleFilePath),
                name: "AmpRulesConfigurator-" + index,
                workspace: ampWorkspaceArn
            });
            if (index > 0){
                ruleGroupsNamespace.node.addDependency(ruleGroupsNamespaces.at(-1)!);
            }
            ruleGroupsNamespaces.push(ruleGroupsNamespace);
        });

        return ruleGroupsNamespaces;
    }

}
