import { defineStore } from 'pinia'
const url = 'https://pokeapi.co/api/v2/pokemon?limit=150';

export const usePokeStore = defineStore('index', () => {
    let loaded = false;
    const pokemonDetails = {};
    let pokemon = ref([]);
    const fetchPokemon = async () => {
        if (loaded) {
            return;
        }
        if (process.server) {
            try {
                const bpnode = useBpContext();
                bpnode.bdlogger.notice('hello bpnode');
            } catch (e) {
                console.log(e)
            }
            // const response = await bpnode.ufc.request({
            //     // ...
            // });
        }
        const { data } = await useFetch(url);
        const loadedPokemon = data.value.results.map((data, index) => {
            return {
                name: data.name,
                id: index + 1,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
            };
        });
        pokemon.value = loadedPokemon;
        loaded = true;
    };
    const getPokemonById = async id => {
        if (pokemonDetails[id]) {
            return pokemonDetails[id];
        }
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
            const { data } = await useFetch(url);
            pokemonDetails[id] = data.value;
            return data;
        } catch (ex) {
            console.log(ex);
            return null;
        }
    };

    return { pokemon, fetchPokemon, getPokemonById };
});