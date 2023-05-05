export const useUFCRequest = async (options = {}) => {
    if (!process.server) {
        return null;
    }
    const ctx = useBpContext();
    if (!ctx) {
        return null;
    }
    let data = {};
    try {
        const response = await ctx.ufc.request(options);
        data = response.data;
    } catch (ex) {
        throw ex;
    }
    return data;
}