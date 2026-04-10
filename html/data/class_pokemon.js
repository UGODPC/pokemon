import pokemons from "./pokemons.js";
import pokemon_types from "./pokemon_types.js";
import pokemon_moves from "./pokemon_moves.js";
import { Type } from "./class_type.js";
import { Attack } from "./class_attack.js";
import type_effectiveness from "./type_effectiveness.js";

class Pokemon
{
    static all_pokemons = {};

    constructor(nom)
    {
        let poke = pokemons.find(p => p.pokemon_name === nom && p.form === "Normal");

        this._id_pokemon = poke.pokemon_id;
        this._nom_pokemon = poke.pokemon_name;
        this._stamina_pokemon = poke.base_stamina;
        this._base_attaque_pokemon = poke.base_attack;
        this._base_defense_pokemon = poke.base_defense;

        let typeEntry = pokemon_types.find(t => t.pokemon_name === nom && t.form === "Normal");
        this._types_pokemon = typeEntry.type.map(t => Type.get(t));

        let moveEntry = pokemon_moves.find(m => m.pokemon_name === nom && m.form === "Normal");

        this._attaques_rapides_pokemon = moveEntry.fast_moves
            .map(name => Object.values(Attack.all_attacks).find(a => a.nom_attack === name))
            .filter(a => a !== undefined);

        this._attaques_chargees_pokemon = moveEntry.charged_moves
            .map(name => Object.values(Attack.all_attacks).find(a => a.nom_attack === name))
            .filter(a => a !== undefined);
    }

    get id_pokemon()
    {
        return this._id_pokemon;
    }

    getTypes()
    {
        return this._types_pokemon;
    }

    getAttacks()
    {
        return this._attaques_rapides_pokemon.concat(this._attaques_chargees_pokemon);
    }

    static getWeakestEnnemies(attackName) 
    {
        let attaque = Object.values(Attack.all_attacks).find(a => a.nom_attack === attackName);
        if (!attaque) {
            console.log(`L'attaque '${attackName}' n'a pas été trouvée.`);
            return [];
        }

        let typeAttaque = attaque.type_attack;
        let maxEfficacite = -1;
        let pokemonsFaibles = [];

        for (let p of Object.values(Pokemon.all_pokemons)) {
            let efficacite = 1;
            for (let t of p.getTypes()) {
                efficacite *= type_effectiveness[typeAttaque][t.type];
            }

            if (efficacite > maxEfficacite) {
                maxEfficacite = efficacite;
                pokemonsFaibles = [p];
            } else if (efficacite === maxEfficacite) {
                pokemonsFaibles.push(p);
            }
        }

        for (let p of pokemonsFaibles) {
            console.log(`- ${p.toString()}`);
        }

        return pokemonsFaibles;
    }

    getBestFastAttacksForEnnemy(print, pokemonName)
    {
        let attaques = this._attaques_rapides_pokemon;
        let ennemy = new Pokemon(pokemonName);

        let result = []
        for(let a of attaques)
        {
            let efficacite = 1
            for(let t of ennemy.getTypes())
            {
                efficacite *= type_effectiveness[a.type_attack][t.type];
            }
            let degats = a._puissance_attack * efficacite * (this._base_attaque_pokemon / ennemy._base_defense_pokemon);
            result.push({atk: a, pts: degats, eff: efficacite});
        }
        result.sort(function(a, b) {
            let c = a.pts - b.pts;
        }).reverse();

        /*let bestAttaque = result[0];
        console.log(bestAttaque);

        let test1 = result.forEach(elem => {
            console.log(elem.atk._nom_attack);
        });*/
        
        if(print)
        {
            console.table(result);
        }
        else
        {
            console.table(result[0]); 
        }
        return result;
    }

    toString()
    {
        let nomsTypes = this._types_pokemon.map(t => t.type).join(', ');
        let nomsRapides = this._attaques_rapides_pokemon.map(a => a.nom_attack).join(', ');
        let nomsChargees = this._attaques_chargees_pokemon.map(a => a.nom_attack).join(', ');

        return `${this._nom_pokemon} : #${this._id_pokemon}, [${nomsTypes}], [STA: ${this._stamina_pokemon}, ATK: ${this._base_attaque_pokemon}, DEF: ${this._base_defense_pokemon}], Rapides = [${nomsRapides}], Chargées = [${nomsChargees}]`;
    }
}

function fill_pokemons()
{
    for (let poke of pokemons)
    {
        if (poke.form !== "Normal") continue;
        let pokemon = new Pokemon(poke.pokemon_name);
        Pokemon.all_pokemons[pokemon.id_pokemon] = pokemon;
    }
}

fill_pokemons();

// Test
// console.log(bulbasaur.toString());

export { Pokemon };