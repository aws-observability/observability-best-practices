import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

import { AwsRum } from 'aws-rum-web';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="hero__subtitle">
          <Link
            to="https://aws-experience.com/amer/smb/events/series/Cloud-Operations-Enablement"
            style={{color: 'white', textDecoration: 'underline'}}>
            📅 Register for upcoming events for AWS Cloud Operations
          </Link>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/home">
             Let's dive in!
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  try {
    const config = {
      sessionSampleRate: 1,
      identityPoolId: "us-east-2:27bab94f-d1e8-4816-a2b1-4b744240f6e0",
      endpoint: "https://dataplane.rum.us-east-2.amazonaws.com",
      telemetries: ["performance","errors","http"],
      allowCookies: false,
      enableXRay: false
    };
  
    const APPLICATION_ID = 'a2880207-9afd-4af8-be67-12b15a338ccf';
    const APPLICATION_VERSION = '1.0.0';
    const APPLICATION_REGION = 'us-east-2';
  
    const awsRum = new AwsRum(
      APPLICATION_ID,
      APPLICATION_VERSION,
      APPLICATION_REGION,
      config
    );
  } catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
  }
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="AWS Observability best practices">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

