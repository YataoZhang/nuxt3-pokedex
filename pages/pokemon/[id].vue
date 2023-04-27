<template>
    <div class="flex flex-col items-center">
        <h1 class="text-4xl text-center my-8 uppercase">{{ pokeman.name }}</h1>
        <p>
            Type: <strong>{{ type }}</strong> | Height:
            <strong>{{ pokeman.height }}</strong> | Weight:
            <strong>{{ pokeman.weight }}</strong>
        </p>
        <img
            class="card-image"
            :src="pokeman.sprites['front_default']"
            :alt="pokeman.name"
        />
    </div>
</template>

<script setup>
import { usePokeStore } from '../../store';
const { getPokemonById } = usePokeStore();
const route = useRoute();
let id = route.params.id;
const { value: pokeman } = await getPokemonById(id);
let type = pokeman.types[0].type.name;
useHead({
    titleTemplate: 'Pokedex - ' + pokeman.name,
});
</script>
