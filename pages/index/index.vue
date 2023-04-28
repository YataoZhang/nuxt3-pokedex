<template>
    <h1 class="text-4xl text-center my-8 uppercase">Nuxt Pokedex</h1>
    <input
        class="w-full rounded-md text-lg p-4 border-2 border-gray-200"
        v-model="searchTerm"
        placeholder="Search Pokemon"
    />
    <div class="py-4 grid gap-4 md:grid-cols-2 grid-cols-1">
        <pokemanCard
            v-for="(item, index) in filterPokemon"
            :key="index"
            :pokeman="item"
        ></pokemanCard>
    </div>
</template>

<script>
export const watchdog = {
    guardType: 1,
    sniffGuest: () => false,
};
</script>

<script setup>
import { storeToRefs } from 'pinia';
import { usePokeStore } from '../../store';
useHead({
    title: 'Pokedex',
});

let searchTerm = ref('');
let filterPokemon = ref([]);
const store = usePokeStore();
const { pokemon: pokemans } = storeToRefs(store);
watch(searchTerm, (newTerm) => {
    const pokes = pokemans.value;
    if (newTerm) {
        filterPokemon.value = pokes.filter(({ name }) => {
            return name.toLowerCase().includes(newTerm.toLowerCase());
        });
    } else {
        filterPokemon.value = [...pokes];
    }
});

await store.fetchPokemon();
filterPokemon.value = [...pokemans.value];
</script>
