import { useBpContext } from '~/modules/bpnode/hooks';

export default defineEventHandler((event) => {
    const ctx = useBpContext(event);
    return {
        user: ctx.user,
        api: 'works'
    }
});