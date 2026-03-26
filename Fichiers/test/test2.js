import { Pokemon } from "../pokemon.js";

function sortPokemonByTypeThenName()
{
    const pokemonsList = Object.values(Pokemon.all_pokemons);

    pokemonsList.sort((a, b) =>
    {
        const nomsTypesA = a.getTypes().map(t => t.type).sort((x, y) => x.localeCompare(y, 'fr'));
        const typeKeyA = nomsTypesA.join('-');

        const nomsTypesB = b.getTypes().map(t => t.type).sort((x, y) => x.localeCompare(y, 'fr'));
        const typeKeyB = nomsTypesB.join('-');

        const cmpTypes = typeKeyA.localeCompare(typeKeyB, 'fr');
        if (cmpTypes !== 0) return cmpTypes;

        return a._nom_pokemon.localeCompare(b._nom_pokemon, 'fr');
    });

    for (let pokemon of pokemonsList)
    {
        console.log(pokemon.toString());
    }
}

console.log(sortPokemonByTypeThenName());