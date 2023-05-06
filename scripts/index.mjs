import { u as useNitroApp, a as useRuntimeConfig, g as getRouteRules } from '../.output/server/chunks/nitro/node.mjs';
import { handler } from '../.output/server/index.mjs';
import { eventHandler } from 'h3';
import Application from 'koa';

console.log(useRuntimeConfig());

function replaceIndex(stack) {
    const length = stack.length;
    stack.splice(length - 2, 0, stack.splice(length - 1, 1)[0]);
}

const app = new Application();
const nitroApp = useNitroApp();

nitroApp.h3App.use(eventHandler((event) => {
    console.log(getRouteRules(event));
    Object.assign(event, { ctx: event.node.req.__inject_context__ });
    event.node.req.__inject_context__ = undefined;
}));

replaceIndex(nitroApp.h3App.stack);

app.use(async function (ctx, next) {
    // just use bypassing
    ctx.respond = false;
    ctx.user = { isLogin: 1, username: 'zhangyatao' };
    ctx.bdlogger = {
        notice(content) {
            console.log('[NOTICE] ', content);
        },
        fatal(content) {
            console.log('[FATAL] ', content);
        },
        warning(content) {
            console.log('[WARNING] ', content);
        }
    };
    ctx.ufc = {
        async request(options) {
            return {};
        },
        async bypass(options) {
            return {};
        }
    };
    ctx.req.__inject_context__ = ctx;
    handler(ctx.req, ctx.res);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));