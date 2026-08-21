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

  trailingSlash: true,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  // English only for now. The i18n/ directories still hold ~1670 translated
  // documents, but none of them cover docs/solutions/, so every non-English
  // locale rendered an untranslated catalog with zero entries. Publishing that
  // is worse than publishing nothing. Files are retained on disk; restore a
  // locale here once its solutions content is translated.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
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
          include: ['solutions/**/*.{md,mdx}', 'events/**/*.{md,mdx}'],
          exclude: ['**/_catalog/**'],
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
         language: ["en", "ja", "ko"],
         indexBlog: false,
       }),
     ],

     // APM docs (converted from cw-apm-docs) served under /apm/
     [
       '@docusaurus/plugin-content-docs',
       /** @type {import('@docusaurus/plugin-content-docs').Options} */
       ({
         id: 'apm',
         path: 'docs-apm',
         routeBasePath: 'apm',
         sidebarPath: require.resolve('./sidebarsApm.js'),
         editUrl:
           'https://github.com/aws-observability/observability-best-practices/blob/main/docusaurus/',
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
            to: '/events/',
            position: 'left',
            label: 'Events',
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
