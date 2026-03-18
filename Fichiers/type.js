import type_effectiveness from "./Info Pokémons/type_effectiveness.js";

class Type {
    static all_types = {};

    constructor(type) {
        this._type = type;
        this._efficacite = type_effectiveness[type];
    }
    get type() {
        return this._type;
    }
    get efficacite() {
        return this._efficacite;
    }

    static get(type) {
        if (!Type.all_types[type]) {
            Type.all_types[type] = new Type(type);
        }
        return Type.all_types[type];
    }

    toString() {
        const groups = {};
        for (let defenseType in this.efficacite) {
            const val = this.efficacite[defenseType];
            if (!groups[val]) {
                groups[val] = [];
            }
            groups[val].push(defenseType);
        }

        const sortedVals = Object.keys(groups).sort((a, b) => b - a);

        const parts = [];
        for (let vals of sortedVals) {
            const sortedTypes = groups[vals].sort();
            let valStr = vals;
            if (!valStr.includes('.')) {
                valStr += '.0';
            }
            parts.push(`${valStr} = [${sortedTypes.join(', ')}]`);
        }

        return `${this.type} : ${parts.join(', ')}`;
    }
}

function fill_types() {
    for (let type in type_effectiveness) {
        Type.get(type);
    }
}

fill_types();

// let type = Type.get("Bug");
// console.log(type.toString());

// let memeType = Type.get("Bug");
// console.log(type === memeType);

// console.log(Type.all_types);

export { Type };