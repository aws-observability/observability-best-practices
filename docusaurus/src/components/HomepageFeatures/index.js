import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

const FeatureList = [
  {
    title: 'Guides',
    Svg: require('@site/static/img/guide.svg').default,
    description: (
      <>
        <Translate id="featureList.guides.description">
            Guides were designed from the ground up to be easily followed and implemented, getting your cloud monitoring up and running quickly.
        </Translate>
      </>
    ),
    link: '/guides',
  },
  {
    title: 'Signals',
    Svg: require('@site/static/img/signals.svg').default,
    description: (
      <>
        <Translate id="featureList.signals.description">
          Gain comprehensive insights into your AWS environment through key metrics, logs, and performance indicators.
        </Translate>
      </>
    ),
    link: '/signals/logs',
  },
  {
    title: 'Tools',
    Svg: require('@site/static/img/tools.svg').default,
    description: (
      <>
        <Translate id="featureList.tools.description">
          Streamline your AWS monitoring with purpose-built solutions for efficient data collection, analysis, and visualization.
        </Translate>
      </>
    ),
    link: '/tools/observability_accelerator',
  },
  {
    title: 'Recipes',
    Svg: require('@site/static/img/recipes.svg').default,
    description: (
      <>
        <Translate id="featureList.recipes.description">
          Implement proven AWS observability patterns to quickly solve common monitoring and troubleshooting challenges.
        </Translate>
      </>
    ),
    link: '/recipes',
  },
  {
    title: 'FAQs',
    Svg: require('@site/static/img/faq.svg').default,
    description: (
      <>
        <Translate id="featureList.faqs.description">
          Find quick answers to common AWS observability questions, clarifying key concepts and best practices.
        </Translate>
      </>
    ),
    link: '/faq/general',
  },

  {
    title: 'Patterns',
    Svg: require('@site/static/img/patterns.svg').default,
    description: (
      <>
        <Translate id="featureList.patterns.description">
          Learn step-by-step AWS observability implementation through comprehensive, easy-to-follow instructional resources.
        </Translate>
      </>
    ),
    link: '/patterns/Tracing/xrayec2',
  },
  {
    title: 'Persona',
    Svg: require('@site/static/img/persona.svg').default,
    description: (
      <>
        <Translate id="featureList.patterns.description">
          Persona specific best practices and recommendations for AWS observability.
        </Translate>
      </>
    ),
    link: '/persona/cloud_engineer',
  },
  {
    title: 'Resources',
    Svg: require('@site/static/img/resources.svg').default,
    description: (
      <>
        <Translate id="featureList.patterns.description">
          Resources for AWS observability.
        </Translate>
      </>
    ),
    link: '/resources',
  },
  {
    title: 'MCP',
    Svg: require('@site/static/img/mcp.svg').default,
    description: (
      <>
        <Translate id="featureList.patterns.description">
          MCP (Model Context Protocol) server for AWS observability.
        </Translate>
      </>
    ),
    link: '/mcp',
  },
  {
    title: 'CloudOps',
    Svg: require('@site/static/img/cloudops.svg').default,
    description: (
      <>
        <Translate id="featureList.cloudOps.description">
          Learn the AWS Cloud Operations Best Practices.
        </Translate>
      </>
    ),
    link: 'https://aws-samples.github.io/cloud-operations-best-practices/',
  },
];

function Feature({Svg, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Link to={link}>
          <Svg className={styles.featureSvg} role="img" />
        </Link>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}