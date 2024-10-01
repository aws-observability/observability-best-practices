import { utils } from "@aws-quickstart/eks-blueprints";
import { HelmAddOn } from '@aws-quickstart/eks-blueprints';
import * as cdk from 'aws-cdk-lib';

export const logger = utils.logger;

export function errorHandler(app: cdk.App, ...message: string[]) {
    logger.info(message);
    new EmptyStack(app);
}

export function configureApp(logLevel? : number): cdk.App {
    logger.settings.minLevel = logLevel ?? 2; // debug., 3 info
    logger.settings.hideLogPositionForProduction = true;
    utils.userLog.info("=== Run make compile before each run, if any code modification was made. === \n\n");

    const account = process.env.CDK_DEFAULT_ACCOUNT!;
    const region = process.env.CDK_DEFAULT_REGION!;
    
    HelmAddOn.validateHelmVersions = false;
    
    return new cdk.App({context: { account, region }});
}

export async function prevalidateSecrets(pattern: string, region?: string, ...secrets: string[]) {
    for(let secret of secrets) {
        try {
            await utils.validateSecret(secret, region ?? process.env.CDK_DEFAULT_REGION!);
        }
        catch(error) {
            throw new Error(`${secret} secret must be setup for the ${pattern} pattern to work`);
        }
    }
}

export class EmptyStack extends cdk.Stack {
    constructor(scope: cdk.App, ...message: string[]) {
        super(scope, "empty-error-stack");
        if(message) {
            message.forEach(m => logger.info(m));
        }
    }
}


