import { Pokemon } from '../data/class_pokemon.js';

let currentPage = 1;
const itemsPerPage = 25;
let pokemonsList = [];

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
}

function updatePagination() {
    var totalPages = Math.ceil(pokemonsList.length / itemsPerPage);
    if (totalPages === 0) totalPages = 1;

    document.getElementById('current-page').innerText = currentPage;
    document.getElementById('total-pages').innerText = totalPages;

    document.getElementById('btn-prec').disabled = (currentPage === 1);
    document.getElementById('btn-suiv').disabled = (currentPage === totalPages);
}


function renderTable() {
    var tbody = document.getElementById('pokemon-table-body');
    tbody.innerHTML = '';

    var start = (currentPage - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var pageItems = pokemonsList.slice(start, end);

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

        var tdGen = document.createElement('td');
        var gen = getGeneration(poke.id_pokemon);
        tdGen.innerText = "Génération " + gen;
        tr.appendChild(tdGen);

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
        var formattedId = String(poke.id_pokemon).padStart(3, '0');
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
            popup.style.left = (e.clientX + 20) + 'px';
            popup.style.top = (e.clientY + 20) + 'px';
        });
        img.addEventListener('mousemove', function(e) {
            var popup = document.getElementById('image-popup');
            popup.style.left = (e.clientX + 20) + 'px';
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
    html += '<p><strong>Génération :</strong> ' + getGeneration(poke.id_pokemon) + '</p>';
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

function getGeneration(id) {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
}

init();
