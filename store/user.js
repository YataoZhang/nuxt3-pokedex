import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
    const user = {};
    const bpnode = useBpContext();
    if (bpnode) {
        Object.assign(user, bpnode.user);
    }
    return { user };
});