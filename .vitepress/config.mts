import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid ({
  title: "Aspire Workshop",
  description: "Documentation for the DotNET Q1 Workshop",
  base: "/aspire-workshop/",
  themeConfig: {
    nav: [
    ],

    sidebar: [
      {
        items: [
          { text: 'Workshop Summary', link: '/summary' },
          { text: 'Prerequisites', link: '/prerequisites' }
        ]
      },
      // {
      //   text: 'What is .NET Aspire?',
      //   items: [
      //     { text: 'Introduction', link: '/aspire/introduction' }
      //   ]
      // },
      // {
      //   text: 'Sample Project',
      //   items: [
      //     { text: 'New Project', link: '/sample/new-project' },
      //     { text: 'Dashboard', link: '/sample/dashboard' },
      //     { text: 'Commands', link: '/sample/commands' },
      //     { text: 'Messaging', link: '/sample/messaging' },
      //   ]
      // },
      // {
      //   text: 'MS Example Project',
      //   items: [
      //     { text: 'New Project', link: '/sample/new-project' },
      //     { text: 'Dashboard', link: '/sample/dashboard' },
      //     { text: 'Commands', link: '/sample/commands' },
      //     { text: 'Messaging', link: '/sample/messaging' },
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bjornkpu/aspire-workshop' }
    ]
  }
})
