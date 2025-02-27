import { withMermaid } from "vitepress-plugin-mermaid";

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
      {
        text: 'What is .NET Aspire?',
        items: [
          { text: 'Introduction', link: '/aspire/introduction' }
        ]
      },
      {
        text: 'Sample Project',
        items: [
          { text: 'New Project', link: '/sample/new-project' },
          { text: 'Running .NET Aspire', link: '/sample/running-aspire' },
          { text: 'Explore the application', link: '/sample/explore' }
        ]
      },
      {
        text: 'Aspire Sample Project',
        items: [
          { text: 'Aspire Sample', link: '/aspire-sample/aspire-sample' },
          { text: 'SPAs', link: '/aspire-sample/spa' },
          { text: 'Standalone', link: '/aspire-sample/standalone' },
          { text: 'Aspire Shop', link: '/aspire-sample/aspire-shop' },
          { text: 'Messaging', link: '/aspire-sample/messaging' },
        ]
      },
      {
        items: [
          { text: 'References', link: '/references' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/bjornkpu/aspire-workshop' }
    ]
  }
})
