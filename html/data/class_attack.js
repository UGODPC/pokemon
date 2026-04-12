class Attack
{
    static all_attacks = {};
    static all_fast_attacks = {};

    constructor(id_attack, nom_attack, type_attack, puissance_attack, duree_attack)
    {
        this._id_attack = id_attack;
        this._nom_attack = nom_attack;
        this._type_attack = type_attack;
        this._puissance_attack = puissance_attack;
        this._duree_attack = duree_attack;
    }

    get id_attack()
    {
        return this._id_attack;
    }

    get nom_attack()
    {
        return this._nom_attack;
    }

    get type_attack()
    {
        return this._type_attack;
    }

    get puissance_attack()
    {
        return this._puissance_attack;
    }

    get duree_attack()
    {
        return this._duree_attack;
    }

    toString()
    {
        return `${this._nom_attack} : #${this._id_attack}, ${this._type_attack}, ${this._puissance_attack}, ${this._duree_attack}ms`;
    }
}

function fill_attacks()
{
    //Pour les attaques de base
    for(let move of pokemon_moves)
    {

        let attack = new Attack(
            move.move_id,
            move.name,
            move.type,
            move.power,
            move.duration
        );

        Attack.all_attacks[move.move_id] = attack;
    }

    //Pour les attaques rapides
    for(let move of fast_moves)
    {

        let attack = new Attack(
            move.move_id,
            move.name,
            move.type,
            move.power,
            move.duration
        );

        Attack.all_attacks[move.move_id] = attack;
        Attack.all_fast_attacks[move.move_id] = attack;
    }

    //Pour les attaques chargées
    for(let move of charged_moves)
    {

        let attack = new Attack(
            move.move_id,
            move.name,
            move.type,
            move.power,
            move.duration
        );

        Attack.all_attacks[move.move_id] = attack;
    }
}

fill_attacks();