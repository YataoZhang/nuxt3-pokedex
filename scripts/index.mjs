import { u as useNitroApp } from '../.output/server/chunks/nitro/node.mjs';
import { handler } from '../.output/server/index.mjs';
import { eventHandler, use } from 'h3';
import Application from 'koa';

function replaceIndex(stack) {
    const length = stack.length;
    stack.splice(length - 2, 0, stack.splice(length - 1, 1)[0]);
}

const app = new Application();
const nitroApp = useNitroApp();

nitroApp.h3App.use(eventHandler((event) => {
    Object.assign(event, { koaContext: event.node.req.__koa_context__ });
    event.node.req.__koa_context__ = undefined;
}));

replaceIndex(nitroApp.h3App.stack);

app.use(async function (ctx, next) {
    // just use bypassing
    ctx.respond = false;
    ctx.req.__koa_context__ = ctx;
    handler(ctx.req, ctx.res);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));