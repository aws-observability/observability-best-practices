// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AWS Observability Best Practices',
  tagline: '🖥️ Improve AWS Cloud Observability 🚀',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://aws-observability.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/observability-best-practices/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'AWS', // Usually your GitHub org/user name.
  projectName: 'AWS Observability best practices', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en','ja'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      ja: {
        label: '日本語',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          //path: 'docs',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/',
        },
        
        theme: {
          customCss: './src/css/custom.css',
        },
      
      }),
    ],
   

  ],

  plugins: [
   
     [
       require.resolve("@easyops-cn/docusaurus-search-local"),
       ({
         //docsDir: "docs",
         hashed: true,
         indexPages: true,
         language: ["en", "ja"],
         indexBlog: false,
       }),
     ],
   ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'AWS Observability Best Practices',
        logo: {
          alt: 'AWS Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'home',
            position: 'left',
            label: 'Home',
          },
          {
            type: 'doc',
            docId: 'guides/index',
            position: 'left',
            label: 'Guides',
          },
          {
            type: 'doc',
            docId: 'signals/logs',
            position: 'left',
            label: 'Signals',
          },
          {
            type: 'doc',
            docId: 'tools/observability_accelerator',
            position: 'left',
            label: 'Tools',
          },
          {
            type: 'doc',
            docId: 'recipes/index',
            position: 'left',
            label: 'Recipes',
          },
          {
            type: 'doc',
            docId: 'faq/general',
            position: 'left',
            label: 'FAQ',
          },
          {
            type: 'doc',
            docId: 'patterns/Tracing/xrayec2',
            position: 'left',
            label: 'Patterns',
          },
          {
            type: 'doc',
            docId: 'persona/cloud_engineer',
            position: 'left',
            label: 'Persona',
          },
          {
            type: 'doc',
            docId: 'resources/index',
            position: 'left',
            label: 'Resources',
          },
          {
            type: 'doc',
            docId: 'contributors',
            position: 'left',
            label: 'Contributors',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/aws-observability/observability-best-practices',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        }
      },
      colorMode: {
          defaultMode: 'light',
          disableSwitch: false,
          respectPrefersColorScheme: true,
      },  
      footer: {
        style: 'dark',
        copyright: `Built with ❤️ at AWS. <br/> © ${new Date().getFullYear()}.  Amazon.com, Inc. or its affiliates. All Rights Reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
