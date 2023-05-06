
export function useBpContext(event) {
    return event.ctx || {};
}

export async function useUFCRequest(event) {
    const ctx = useBpContext(event);
    let data = {};
    try {
        const response = await ctx.ufc.request(options);
        data = response.data;
    } catch (ex) {
        throw ex;
    }
    return data;
}