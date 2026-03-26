import { Pokemon } from "../pokemon.js";
import { Attack } from "../attack.js";

function getPokemonByType(typeName)
{
    const tablo_pokemon = Object.values(Pokemon.all_pokemons);
    const res = tablo_pokemon.filter((pokemon) => pokemon._types_pokemon.some(type => type.type === typeName));
    console.table(tablo_pokemon);
    console.log(`Liste des ${res.length} Pokemons :`);
    res.forEach(res => {
        console.log(`- ${res.toString()}`);
    });
    return res;
}

function getPokemonByAttack(attackName)
{
    let tablo_pokemon = Object.values(Pokemon.all_pokemons);
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

//console.table(getPokemonByType("Water"));
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