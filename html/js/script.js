import { Pokemon } from '../data/class_pokemon.js';

let currentPage = 1;
const itemsPerPage = 25;
let pokemonsList = [];
let colonneTri = "_id_pokemon";
let ascTri = true;
let filtrage = {
    type: null,
    attaque: null,
    nom: null
};

function init() {
    pokemonsList = Object.values(Pokemon.all_pokemons);
    updatePagination();
    renderTable();

    document.getElementById('btn-prec').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            renderTable();
        }
    });

    document.getElementById('btn-suiv').addEventListener('click', function() {
        var totalPages = Math.ceil(pokemonsList.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            renderTable();
        }
    });

    document.getElementById('btn-fermer').addEventListener('click', function() {
        document.getElementById('overlay').style.display = 'none';
    });

    document.getElementById('overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    document.querySelectorAll("#mainTable th:not(.no-sort)").forEach(element => {
            element.addEventListener("click", function(e) {
                const el = document.querySelector("#mainTable th.sorted");
                currentPage = 1;
                updatePagination();
                if(el && el != e.target)
                {
                    el.classList.remove("sorted", "asc");
                }
                e.target.classList.toggle("asc");
                e.target.classList.add("sorted");
                colonneTri = e.target.getAttribute("data-nomColonne");
                ascTri = e.target.classList.contains("asc");
                renderTable();
            })
    });

}

function updatePagination() {
    var totalPages = Math.ceil(pokemonsList.length / itemsPerPage);
    if (totalPages === 0) totalPages = 1;

    document.getElementById('current-page').innerText = currentPage;
    document.getElementById('total-pages').innerText = totalPages;

    document.getElementById('btn-prec').disabled = (currentPage === 1);
    document.getElementById('btn-suiv').disabled = (currentPage === totalPages);
}

function filtrerListe(elem)
{
    return true;
}

function trierListe(a, b)
{
    let res = 0;
    if(typeof a[colonneTri] === "string")
    {
        if(a[colonneTri] < b[colonneTri])
        {
            res = -1;
        }
        if(a[colonneTri] > b[colonneTri])
        {
            res = 1;
        }
    }

    if(Array.isArray(a[colonneTri]))
    {
        if(a[colonneTri].join("") < b[colonneTri].join("")) //join pour les valeurs du tableau en chaînes de charactères.
        {
            res = -1;
        }
        if(a[colonneTri].join("") > b[colonneTri].join(""))
        {
            res = 1;
        }
    }

    if(typeof a[colonneTri] === "number")
    {
        res = a[colonneTri] - b[colonneTri];
    }
    
    if(res == 0)
    {
        res = a["_nom_pokemon"] < b["_nom_pokemon"] ? -1 : 1;
        if(ascTri == false)
        {
            res *= -1; //Pour inverser le trie sur les noms quand il y a une égalité .
        }
    }
    return res;
}


function renderTable() {
    var tbody = document.getElementById('pokemon-table-body');
    tbody.innerHTML = '';

    var start = (currentPage - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var pokemonsFiltre = pokemonsList.filter(filtrerListe);
    var pokemonsTri = pokemonsFiltre.sort(trierListe); //Slice avant le sort selon le trie sur tout le tableau ou seulement par page...
    if(ascTri == false)
    {
        pokemonsTri = pokemonsTri.toReversed();
    }
    var pageItems = pokemonsTri.slice(start, end);

    for (var i = 0; i < pageItems.length; i++) {
        var poke = pageItems[i];
        var tr = document.createElement('tr');
        tr.setAttribute('data-pokemon-id', poke.id_pokemon);

        var tdId = document.createElement('td');
        tdId.innerText = poke.id_pokemon;
        tr.appendChild(tdId);

        var tdNom = document.createElement('td');
        tdNom.innerText = poke._nom_pokemon;
        tr.appendChild(tdNom);

        var tdTypes = document.createElement('td');
        tdTypes.innerText = poke.getTypes().map(function(t) { return t.type; }).join(', ');
        tr.appendChild(tdTypes);

        var tdStamina = document.createElement('td');
        tdStamina.innerText = poke._stamina_pokemon;
        tr.appendChild(tdStamina);

        var tdAtk = document.createElement('td');
        tdAtk.innerText = poke._base_attaque_pokemon;
        tr.appendChild(tdAtk);

        var tdDef = document.createElement('td');
        tdDef.innerText = poke._base_defense_pokemon;
        tr.appendChild(tdDef);

        var tdImg = document.createElement('td');
        var img = document.createElement('img');
        var formattedId = String(poke.id_pokemon).padStart(3, '0'); //Pour les pokemons qui ont un id de 1 à 99, forcer l'id à avoir un 0 devant (longueur 3)
        img.src = "images/" + formattedId + ".webp";
        img.alt = poke._nom_pokemon;
        img.addEventListener('mouseenter', function(e) {
            var popupImg = document.getElementById('image-popup-img');
            var trParent = e.target.closest('tr');
            var pokId = trParent.getAttribute('data-pokemon-id');
            var fId = String(pokId).padStart(3, '0');
            popupImg.src = "images/" + fId + ".webp";
            var popup = document.getElementById('image-popup');
            popup.style.display = 'block';
            popup.style.left = (e.clientX + -150) + 'px';
            popup.style.top = (e.clientY + 20) + 'px';
        });
        img.addEventListener('mousemove', function(e) {
            var popup = document.getElementById('image-popup');
            popup.style.left = (e.clientX + -150) + 'px';
            popup.style.top = (e.clientY + 20) + 'px';
        });
        img.addEventListener('mouseleave', function() {
            document.getElementById('image-popup').style.display = 'none';
        });
        tdImg.appendChild(img);
        tr.appendChild(tdImg);

        tr.addEventListener('click', function() {
            var pokId = this.getAttribute('data-pokemon-id');
            afficherDetail(pokId);
        });

        tbody.appendChild(tr);
    }
}

function afficherDetail(pokemonId) {
    var poke = Pokemon.all_pokemons[pokemonId];
    if (!poke) return;

    var formattedId = String(poke.id_pokemon).padStart(3, '0');
    var typesStr = poke.getTypes().map(function(t) { return t.type; }).join(', ');

    var rapides = poke._attaques_rapides_pokemon;
    var chargees = poke._attaques_chargees_pokemon;

    var html = '';
    html += '<h2>' + poke._nom_pokemon + ' (#' + poke.id_pokemon + ')</h2>';
    html += '<img src="images/' + formattedId + '.webp" alt="' + poke._nom_pokemon + '">';
    html += '<p><strong>Types :</strong> ' + typesStr + '</p>';
    html += '<p><strong>Endurance :</strong> ' + poke._stamina_pokemon + '</p>';
    html += '<p><strong>Attaque de base :</strong> ' + poke._base_attaque_pokemon + '</p>';
    html += '<p><strong>Défense de base :</strong> ' + poke._base_defense_pokemon + '</p>';

    html += '<h3>Attaques rapides</h3>';
    if (rapides.length > 0) {
        html += '<table><thead><tr><th>Nom</th><th>Type</th><th>Puissance</th><th>Durée</th></tr></thead><tbody>';
        for (var j = 0; j < rapides.length; j++) {
            var a = rapides[j];
            html += '<tr>';
            html += '<td>' + a._nom_attack + '</td>';
            html += '<td>' + a._type_attack + '</td>';
            html += '<td>' + a._puissance_attack + '</td>';
            html += '<td>' + a._duree_attack + ' ms</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
    } else {
        html += '<p>Aucune</p>';
    }

    html += '<h3>Attaques chargées</h3>';
    if (chargees.length > 0) {
        html += '<table><thead><tr><th>Nom</th><th>Type</th><th>Puissance</th><th>Durée</th></tr></thead><tbody>';
        for (var k = 0; k < chargees.length; k++) {
            var b = chargees[k];
            html += '<tr>';
            html += '<td>' + b._nom_attack + '</td>';
            html += '<td>' + b._type_attack + '</td>';
            html += '<td>' + b._puissance_attack + '</td>';
            html += '<td>' + b._duree_attack + ' ms</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
    } else {
        html += '<p>Aucune</p>';
    }

    document.getElementById('detail-contenu').innerHTML = html;
    document.getElementById('overlay').style.display = 'flex';
}

init();