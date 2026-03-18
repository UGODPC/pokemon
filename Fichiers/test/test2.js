import { Attack } from "../attack.js";

function getAttacksByType(typeName) {
    let typeLower = typeName.toLowerCase();
    let attacks = Object.values(Attack.all_attacks).filter(a => a.type_attack && a.type_attack.toLowerCase() === typeLower);
    
    console.log(`Liste des ${attacks.length} Attaques :`);
    attacks.forEach(attack => {
        console.log(`- ${attack.toString()}`);
    });
}

// Test
getAttacksByType("Bug");
