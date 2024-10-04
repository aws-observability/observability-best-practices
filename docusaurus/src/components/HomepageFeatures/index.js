import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Guides',
    Svg: require('@site/static/img/guide.svg').default,
    description: (
      <>
        Guides were designed from the ground up to be easily followed and implemented, getting your cloud monitoring up and running quickly.
      </>
    ),
    link: '/guides',
  },
  {
    title: 'Signals',
    Svg: require('@site/static/img/signals.svg').default,
    description: (
      <>
        Gain comprehensive insights into your AWS environment through key metrics, logs, and performance indicators.
      </>
    ),
    link: '/signals/alarms',
  },
  {
    title: 'Tools',
    Svg: require('@site/static/img/tools.svg').default,
    description: (
      <>
       Streamline your AWS monitoring with purpose-built solutions for efficient data collection, analysis, and visualization.
      </>
    ),
    link: '/tools/observability_accelerator',
  },
  {
    title: 'Recipes',
    Svg: require('@site/static/img/recipes.svg').default,
    description: (
      <>
        Implement proven AWS observability patterns to quickly solve common monitoring and troubleshooting challenges.
      </>
    ),
    link: '/recipes',
  },
  {
    title: 'FAQs',
    Svg: require('@site/static/img/faq.svg').default,
    description: (
      <>
        Find quick answers to common AWS observability questions, clarifying key concepts and best practices.
      </>
    ),
    link: '/faq/adot',
  },
  {
    title: 'Patterns',
    Svg: require('@site/static/img/patterns.svg').default,
    description: (
      <>
        Learn step-by-step AWS observability implementation through comprehensive, easy-to-follow instructional resources.
      </>
    ),
    link: '/patterns/multiaccount',
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