
import type { EnhanceAppContext, Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import Layout from './layout.vue'
import Header from './header.vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

import '../../tailwind.css'

// import {
//   NolebaseGitChangelogPlugin
// } from '@nolebase/vitepress-plugin-git-changelog/client'
// import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-title-after': () => h(Header)
        })
    },
    enhanceApp({ app }: EnhanceAppContext) {
        app.use(TwoslashFloatingVue)
        // app.use(NolebaseGitChangelogPlugin)
    }
} satisfies Theme
