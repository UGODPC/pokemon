import { Pokemon } from "../pokemon.js";
import { Attack } from "../attack.js";

function getPokemonByType(typeName)
{
    const tablo_pokemon = Object.values(Pokemon.all_pokemons);
    const res = tablo_pokemon.filter((pokemon) => pokemon._types_pokemon.some(type => type.type === typeName));
    console.log(`Liste des ${res.length} Pokemons par nom :`);
    res.forEach(res => {
        console.log(`- ${res.toString()}`);
    });
    return res;
}

function getPokemonByAttack(attackName)
{
    const tablo_pokemon = Object.values(Pokemon.all_pokemons);
    const res = tablo_pokemon.filter((pokemon) => pokemon._attaques_rapides_pokemon.some(atk => atk.nom_attack === attackName) || pokemon._attaques_chargees_pokemon.some(atkChargee => atkChargee.nom_attack === attackName));
    console.log(`Liste des ${res.length} Pokemons par attaques :`);
    res.forEach(res => {
        console.log(`- ${res.toString()}`);
    });
    return res
}

function getAttacksByType(typeName) {
    let typeLower = typeName.toLowerCase();
    let attacks = Object.values(Attack.all_attacks).filter(a => a.type_attack && a.type_attack.toLowerCase() === typeLower);
    
    console.log(`Liste des ${attacks.length} Attaques :`);
    attacks.forEach(attack => {
        console.log(`- ${attack.toString()}`);
    });
}

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

function getWeakestEnnemies(attackName)
{

}

function getBestFastAttacksForEnemy(print, pokemonName)
{

}

function fastFight(pokemonNameA, pokemonNameB)
{

}

//console.table(tablo_pokemon);
getPokemonByType("Water");
console.log("----------------------------------------");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("----------------------------------------");
getPokemonByAttack("Bite");
console.log("----------------------------------------");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("----------------------------------------");
getAttacksByType("Bug");
console.log("----------------------------------------");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("----------------------------------------");
console.log(`Liste des Pokemon par type puis nom :`);
console.log(sortPokemonByTypeThenName());
console.log("----------------------------------------");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("|                                      |");
console.log("----------------------------------------");
Pokemon.getBestFastAttacksForEnemy(true, "Bulbasaur");