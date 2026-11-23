// CloudWatch RUM for the whole site.
//
// This lives in a client module, not a page, so it runs once on every route
// and does not depend on which page a visitor lands on. It previously sat in
// src/pages/index.js and stopped reporting when that homepage was replaced.
// The web client patches the History API, so in-app navigation is recorded as
// page views without any per-route hook.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const APPLICATION_ID = 'a2880207-9afd-4af8-be67-12b15a338ccf';
const APPLICATION_VERSION = '1.0.0';
const APPLICATION_REGION = 'us-east-2';

const config = {
  sessionSampleRate: 1,
  identityPoolId: 'us-east-2:27bab94f-d1e8-4816-a2b1-4b744240f6e0',
  endpoint: 'https://dataplane.rum.us-east-2.amazonaws.com',
  telemetries: ['performance', 'errors', 'http'],
  allowCookies: false,
  enableXRay: false,
};

// Client modules are also evaluated during static generation, where there is
// no window. Loading the client lazily keeps it off the server and out of the
// main bundle.
if (ExecutionEnvironment.canUseDOM) {
  import('aws-rum-web')
    .then(({AwsRum}) => {
      new AwsRum(APPLICATION_ID, APPLICATION_VERSION, APPLICATION_REGION, config);
    })
    .catch(() => {
      // Telemetry must never break the site (ad blockers, network errors).
    });
}
