export const useUFCRequest = async (options = {}) => {
    if (!process.server) {
        return null;
    }
    const ctx = useBpContext();
    if (!ctx) {
        return null;
    }
    return ctx.ufc.request(options);
}