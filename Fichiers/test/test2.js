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

//console.log(sortPokemonByTypeThenName());


function fastFight(pokemonNameA, pokemonNameB)
{
    let listPokemons = Object.values(Pokemon.all_pokemons);
    let pokemonA = listPokemons.find(p => p._nom_pokemon === pokemonNameA);
    let pokemonB = listPokemons.find(p => p._nom_pokemon === pokemonNameB);

    if (!pokemonA || !pokemonB) {
        console.log("Un ou les deux Pokémons n'ont pas été trouvés.");
        return;
    }

    let hpA = pokemonA._stamina_pokemon;
    let hpB = pokemonB._stamina_pokemon;
    let tour = 1;
    let resultats = [];

    while (hpA > 0 && hpB > 0)
    {
        let attaquant = (tour % 2 !== 0) ? pokemonA : pokemonB;
        let defenseur = (tour % 2 !== 0) ? pokemonB : pokemonA;
        let hpDefenseur = (tour % 2 !== 0) ? hpB : hpA;

        let attackResult = attaquant.getBestFastAttacksForEnemy(false, defenseur._nom_pokemon);

        if (!attackResult || !attackResult.atk) { // a mettre avec la nouvelle fonction de ugo
            console.log("la fonction get bestfast attack a retourné un résultat invalide");
            break;
        }

        hpDefenseur -= attackResult.pts; // a mettre avec la nouvelle fonction de ugo
        if (hpDefenseur < 0) hpDefenseur = 0;

        if (tour % 2 !== 0) hpB = hpDefenseur;
        else hpA = hpDefenseur;

        resultats.push({
            "Tour": tour,
            "Attaquant": attaquant._nom_pokemon,
            "ATK": attaquant._base_attaque_pokemon,
            "Défenseur": defenseur._nom_pokemon,
            "DEF": defenseur._base_defense_pokemon,
            "Nom Attaque": attackResult.atk.nom_attack, // a mettre avec la nouvelle fonction de ugo
            "Efficacité": attackResult.eff, // a mettre avec la nouvelle fonction de ugo
            "Dégâts": attackResult.pts, // a mettre avec la nouvelle fonction de ugo
            "Reste": hpDefenseur
        });

        if (hpDefenseur <= 0) break;

        tour++;
    }
    console.table(resultats);
}

fastFight("Bulbasaur", "Charizard");