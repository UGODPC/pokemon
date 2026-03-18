import pokemons from "./Info Pokémons/pokemons.js";
import pokemon_types from "./Info Pokémons/pokemon_types.js";
import pokemon_moves from "./Info Pokémons/pokemon_moves.js";
import { Type } from "./type.js";
import { Attack } from "./attack.js";

/*
A partir de la description faite plus haut et de votre analyse des structures dans les
fichiers JSON, proposez une classe Pokemon.
IMPORTANT : les types doivent être des objets Type et les attaques des objets Attack.
Écrivez une méthode toString() synthétique qui retourne une chaîne (sans \n)
contenant :
● ID du Pokémon
● Nom
● Stamina
● Base attaque
● Base défense
● Noms des types
● Noms des attaques rapides
● Noms des attaques chargées
Exemple d'un toString() pour Bulbasaur :
Bulbasaur : #1, [Normal], [STA: 155, ATK: 118, DEF: 111], Rapides =
[Vine Whip, Tackle], Chargées = [Sludge Bomb, Seed Bomb, Power Whip]
*/

class Pokemon
{
    static all_pokemons = {};

    constructor(id_pokemon, nom_pokemon, stamina_pokemon, base_attaque_pokemon, base_defense_pokemon, types_pokemon, attaques_rapides_pokemon, attaques_chargees_pokemon)
    {
        this._id_pokemon = id_pokemon;
        this._nom_pokemon = nom_pokemon;
        this._stamina_pokemon = stamina_pokemon;
        this._base_attaque_pokemon = base_attaque_pokemon;
        this._base_defense_pokemon = base_defense_pokemon;
        this._types_pokemon = types_pokemon;               // tableau d'objets Type
        this._attaques_rapides_pokemon = attaques_rapides_pokemon;     // tableau d'objets Attack
        this._attaques_chargees_pokemon = attaques_chargees_pokemon;   // tableau d'objets Attack
    }

    toString()
    {
        let nomsTypes = this._types_pokemon.map(t => t.type).join(', ');
        let nomsRapides = this._attaques_rapides_pokemon.map(a => a.nom_attack).join(', ');
        let nomsChargees = this._attaques_chargees_pokemon.map(a => a.nom_attack).join(', ');

        return `${this._nom_pokemon} : #${this._id_pokemon}, [${nomsTypes}], [STA: ${this._stamina_pokemon}, ATK: ${this._base_attaque_pokemon}, DEF: ${this._base_defense_pokemon}], Rapides = [${nomsRapides}], Chargées = [${nomsChargees}]`;
    }
}

// Fonction utilitaire pour trouver un objet Attack par son nom
function findAttackByName(name)
{
    for (let moveId in Attack.all_attacks)
    {
        if (Attack.all_attacks[moveId].nom_attack === name)
        {
            return Attack.all_attacks[moveId];
        }
    }
    return null;
}

function fill_pokemons()
{
    // Créer des index par (pokemon_id + form) pour les types et les moves
    let typesIndex = {};
    for (let entry of pokemon_types)
    {
        let key = entry.pokemon_id + "_" + entry.form;
        typesIndex[key] = entry.type;
    }

    let movesIndex = {};
    for (let entry of pokemon_moves)
    {
        let key = entry.pokemon_id + "_" + entry.form;
        movesIndex[key] = {
            fast_moves: entry.fast_moves,
            charged_moves: entry.charged_moves
        };
    }

    // Parcourir chaque pokémon et créer l'objet Pokemon
    for (let poke of pokemons)
    {
        let key = poke.pokemon_id + "_" + poke.form;

        // Récupérer les types sous forme d'objets Type
        let typeNames = typesIndex[key] || [];
        let typeObjects = typeNames.map(name => Type.get(name));

        // Récupérer les attaques sous forme d'objets Attack
        let moveData = movesIndex[key] || { fast_moves: [], charged_moves: [] };

        let fastAttacks = moveData.fast_moves
            .map(name => findAttackByName(name))
            .filter(a => a !== null);

        let chargedAttacks = moveData.charged_moves
            .map(name => findAttackByName(name))
            .filter(a => a !== null);

        let pokemon = new Pokemon(
            poke.pokemon_id,
            poke.pokemon_name,
            poke.base_stamina,
            poke.base_attack,
            poke.base_defense,
            typeObjects,
            fastAttacks,
            chargedAttacks
        );

        Pokemon.all_pokemons[key] = pokemon;
    }
}

fill_pokemons();

// Test : afficher Bulbasaur (forme Normal)
let bulbasaur = Pokemon.all_pokemons["1_Normal"];
console.log(bulbasaur.toString());