import { Pokemon } from "../data/class_pokemon.js";
import { Attack } from "../data/class_attack.js";

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
    Pokemon.getWeakestEnnemies(attackName);
}

function fastFight(pokemonNameA, pokemonNameB)
{
    let pokemonA = Object.values(Pokemon.all_pokemons).find(p => p._nom_pokemon === pokemonNameA);
    let pokemonB = Object.values(Pokemon.all_pokemons).find(p => p._nom_pokemon === pokemonNameB);
    
    if(!pokemonA || !pokemonB)
    {
        console.log("Un des Pokémons n'a pas été trouvé.");
        return;
    }
    
    let staminaA = pokemonA._stamina_pokemon;
    let staminaB = pokemonB._stamina_pokemon;
    let tour = 1;
    let historique = [];
    
    console.log(`Début du combat entre ${pokemonNameA} et ${pokemonNameB} !`);
    console.log(`${pokemonNameA} (STA: ${staminaA}) vs ${pokemonNameB} (STA: ${staminaB})`);
    console.log("----------------------------------------");
    
    while(staminaA > 0 && staminaB > 0)
    {
        //Tour du Pokémon A
        let meilleureAttaqueA = pokemonA.getBestFastAttacksForEnnemy(false, pokemonNameB);
        let attaqueA = meilleureAttaqueA[0];
        let degatsA = Math.ceil(attaqueA.pts); //Arrondi à l'unité supérieure avec ceil
        
        staminaB -= degatsA;
        
        historique.push({
            Tour: tour,
            Attaquant: pokemonNameA,
            ATK: staminaA,
            Defenseur: pokemonNameB,
            DEF: staminaB,
            Nom_Attaque: attaqueA.atk.nom_attack,
            Efficacite: attaqueA.eff,
            Degats: degatsA,
            Reste: staminaB
        });
        
        if(staminaB <= 0)
        {
            break;
        }
        
        //Tour du Pokémon B
        let meilleureAttaqueB = pokemonB.getBestFastAttacksForEnnemy(false, pokemonNameA);
        let attaqueB = meilleureAttaqueB[0];
        let degatsB = Math.ceil(attaqueB.pts); //Arrondi à l'unité supérieure avec ceil
        
        staminaA -= degatsB;
        
        historique.push({
            Tour: tour,
            Attaquant: pokemonNameB,
            ATK: staminaB,
            Defenseur: pokemonNameA,
            DEF: staminaA,
            Nom_Attaque: attaqueB.atk.nom_attack,
            Efficacite: attaqueB.eff,
            Degats: degatsB,
            Reste: staminaA
        });
        
        tour++;
    }
    
    console.table(historique);
    console.log("----------------------------------------");
    
    if(staminaA <= 0 && staminaB <= 0)
    {
        console.log("Match nul ! Les deux Pokémons sont K.O. en même temps !");
    }
    else if (staminaA <= 0)
    {
        console.log(`${pokemonNameB} remporte le combat ! Il lui reste ${staminaB} points de stamina.`);
    }
    else
    {
        console.log(`${pokemonNameA} remporte le combat ! Il lui reste ${staminaA} points de stamina.`);
    }
}

//console.table(Pokemon.all_pokemons);
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
console.log(`Liste des Pokémons les plus vulnérables à l'attaque "Water Gun" :`);
getWeakestEnnemies("Water Gun");
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
let bulbasaur = Pokemon.all_pokemons[1];
bulbasaur.getBestFastAttacksForEnnemy(true, "Ivysaur");
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
fastFight("Bulbasaur", "Charizard");