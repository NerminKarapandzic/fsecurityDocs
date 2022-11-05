export default {
    description: 'fSecurity is a security framework for Java Spring framework.',
    title: 'fsecurity',
    themeConfig: {
        siteTitle: 'fsecurity',
        nav: [
            { text: 'Getting started', link: '/getting-started/introduction' },
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com'}
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright @ 2022-present Nermin Karapandzic'
        },
        sidebar: [
            {
                text: 'Getting started',
                items: [
                    { text: 'Introduction', link: '/getting-started/introduction' },
                    { text: 'Installation', link: '/getting-started/installation'},
                    { text: 'Configuration', link: '/getting-started/configuration'},
                ]
            },
            {
                text: 'Examples',
                items: [
                    { text: 'Jwt authentication', link: '/examples/jwt-authentication' },
                    { text: 'Basic authentication', link: '/examples/basic-authentication' },
                ]
            }
        ]
    }
}
