import ExistingEksOpenSourceobservabilityPattern from '../lib/existing-eks-opensource-observability-pattern';
import { configureApp, errorHandler } from '../lib/common/construct-utils';

const app = configureApp();

new ExistingEksOpenSourceobservabilityPattern().buildAsync(app, 'EKS-Infrastructure-Observability-Accelerator').catch((error) => {
    errorHandler(app, "Existing Cluster Pattern is missing information of existing cluster: " + error);
});
