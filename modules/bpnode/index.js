import { defineNuxtModule, createResolver, addVitePlugin, addImportsDir } from '@nuxt/kit';
import fg from 'fast-glob';
import path from 'node:path';


function getAllPagesReg(pagesDir, baseURL = '/') {
    const pages = fg.sync(`${pagesDir}/**/*.(vue|js|jsx|mjs|ts|tsx)`, {
        onlyFiles: true,
    }).map(item => {
        let page = path.join(baseURL, path.relative(pagesDir, item));
        // [x] [...x] 
        page = page.replace(/\.(vue|js|jsx|ts|tsx|mjs)$/, '')
            .replace(/\/index(?=(\/|$))/g, '')
            .replace(/\[[^\.\]]+\]/g, '([^\/?&]+)')
            .replace(/\/\[\.\.\.[^\]]\]/g, '(\/[^\/\?&]+)');

        return page + '/?';
    });

    return pages;
}

function vitePlugin(source) {
    return {
        name: 'nuxt:bpnode',
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'routes.json',
                source: JSON.stringify(source, 0, 4)
            })
        }
    };
}

export default defineNuxtModule({
    meta: {
        // Usually the npm package name of your module
        name: '@baidu/nuxtjs-bpnode',
        // The key in `nuxt.config` that holds your module options
        configKey: 'bpnode',
        // Compatibility constraints
        compatibility: {
            // Semver version of supported nuxt versions
            nuxt: '^3.0.0'
        }
    },
    // Default configuration options for your module, can also be a function returning those
    defaults: {
    },
    // Shorthand sugar to register Nuxt hooks
    hooks: {},
    // The function holding your module logic, it can be asynchronous
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);
        addImportsDir(resolver.resolve('./runtime/composables'));

        if (!nuxt.options.dev) {
            const {
                srcDir,
                dir: { pages },
                app: { baseURL = '/' } = {},
                nitro: { prerender: { routes = [] } = {} } = {}
            } = nuxt.options;

            const pagesDir = path.join(srcDir, pages);
            const allPagesReg = getAllPagesReg(pagesDir, baseURL);
            const routesMeta = {
                allPagesReg,
                routes
            };
            !nuxt.options.nitro && (nuxt.options.nitro = {});
            Object.assign(nuxt.options.nitro, {
                plugins: [vitePlugin(routesMeta, nuxt.options.rootDir)]
            });
        }
    }
})