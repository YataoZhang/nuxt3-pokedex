<template>
    <div class="p-8 max-w-6xl mx-auto">
        <Nav />
        <slot />
    </div>
</template>
<script setup>
import Nav from '../components/nav.vue';
</script>
