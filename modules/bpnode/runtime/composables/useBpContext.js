import get from 'lodash/get';

const MOCK_BPNODE_CONTEXT = {};

if (process.server) {
    Object.assign(MOCK_BPNODE_CONTEXT, {
        bdlogger: {
            notice(content) {
                console.log('[NOTICE] ', content);
            },
            fatal(content) {
                console.log('[FATAL] ', content);
            },
            warning(content) {
                console.log('[WARNING] ', content);
            }
        },
        ufc: {
            async request(options) {
                return {};
            },
            async bypass(options) {
                return {};
            }
        }
    })
}

export const useBpContext = () => {
    if (!process.server) {
        return null;
    }
    const nuxtApp = useNuxtApp();
    return get(nuxtApp.ssrContext, 'event.node.req.__koa_context__', MOCK_BPNODE_CONTEXT);
};