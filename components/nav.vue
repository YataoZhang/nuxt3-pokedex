<template>
    <nav class="flex justify-center w-full relative">
        <NuxtLink
            class="mx-4 text-lg"
            href="/"
            >Home</NuxtLink
        >
        <NuxtLink
            class="mx-4 text-lg"
            href="/about/"
            >About</NuxtLink
        >
        <span class="absolute right-3">{{
            isLogin ? `hello ${username}` : 'not login'
        }}</span>
    </nav>
</template>
<script setup>
import { useUserStore } from '~/store/user';
const store = useUserStore();
const {
    user: { name: username, isLogin },
} = store;
</script>
