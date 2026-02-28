import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Ravenwits Official Documentation',
  tagline: 'API Documentation - Renewable energy production prediction with Machine Learning',
  favicon: 'img/logo.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.ravenwits.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub Pages deployment (custom domain: docs.ravenwits.com)
  organizationName: 'RavenwitsSL',
  projectName: 'docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/RavenwitsSL/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Ravenwits',
      logo: {
        alt: 'Ravenwits Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/api-playground',
          label: 'API Playground',
          position: 'right',
        },
        {
          href: 'https://github.com/RavenwitsSL',
          label: 'GitHub',
          'aria-label': 'GitHub',
          position: 'right',
          className: 'navbar__github-icon',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Ravenwits',
          items: [
            {
              label: 'Website',
              href: 'https://www.ravenwits.com',
            },
            {
              label: 'Contact',
              href: 'mailto:info@ravenwits.com',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Blog',
              href: 'https://www.ravenwits.com/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/RavenwitsSL',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ravenwits.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
