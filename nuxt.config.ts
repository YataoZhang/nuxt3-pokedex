
const PREFIX = '/pokedex';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        baseURL: PREFIX
    },
    nitro: {
        preset: 'node',
        prerender: {
            crawlLinks: false,
            routes: [
                '/', '/about', '/pokemon/1', '/pokemon/2', '/pokemon/3'
            ].map(i => `${PREFIX}${i}`)
        }
    },
    runtimeConfig: {
        // The private keys which are only available server-side
        apiSecret: '123',
        // Keys within public are also exposed client-side
        public: {
            apiBase: '/api'
        }
    },
    postcss: {
        plugins: {
            autoprefixer: {},
        },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt'
    ]
});
