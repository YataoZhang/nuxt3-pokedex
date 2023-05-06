import { defineNuxtModule, createResolver, addVitePlugin, addImportsDir } from '@nuxt/kit';
import fg from 'fast-glob';
import path from 'node:path';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';


function getAllPagesReg(pagesDir, serverDir) {
    function normalizeRoutes(page) {
        page = page.replace(/\.(vue|js|jsx|ts|tsx|mjs)$/, '')
            .replace(/\/?index(?=(\/|$))/g, '')
            .replace(/\[[^\.\]]+\]/g, '([^\/?&]+)')
            .replace(/\/\[\.\.\.[^\]]\]/g, '(\/[^\/\?&]+)');

        if (page) {
            page = path.join('/', page);
        }
        return page;
    }

    const pages = [
        {
            matcher: `${pagesDir}/**/*.(vue|js|jsx|mjs|ts|tsx)`,
            base: pagesDir
        },
        {
            matcher: `${serverDir}/api/**/*.(js|mjs|ts)`,
            base: path.join(serverDir, 'api')
        },
        {
            matcher: `${serverDir}/routes/**/*.(js|mjs|ts)`,
            base: path.join(serverDir, 'routes')
        }
    ].map(({ matcher, base }) => {
        return fg.sync(matcher, {
            onlyFiles: true,
        }).map(item => {
            let page = path.relative(base, item);
            return normalizeRoutes(page);
        });
    })

    return sortBy(flatten(pages), i => i.length).reverse();
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
        authLevel: 2
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
                serverDir,
                app: { baseURL = '/' } = {},
                nitro: { prerender: { routes = [] } = {} } = {}
            } = nuxt.options;

            const pagesDir = path.join(srcDir, pages);
            const allPagesReg = getAllPagesReg(pagesDir, serverDir);
            const routesMeta = {
                baseURL,
                app: path.basename(srcDir),
                authLevel: options.authLevel || 2,
                routesReg: allPagesReg,
                prerenderRoutes: routes.map(i => i.replace(/\/$/, ''))
            };
            !nuxt.options.nitro && (nuxt.options.nitro = {});
            Object.assign(nuxt.options.nitro, {
                rollupConfig: {
                    plugins: [vitePlugin(routesMeta)]
                }
            });
        }
    }
})