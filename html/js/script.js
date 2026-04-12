let currentPage = 1;
const itemsPerPage = 25;
let pokemonsList = [];
let colonneTri = "_id_pokemon";
let ascTri = true;
let filtrage = {
    type: null,
    attaqueRapide: null,
    nom: null
};

//Enlever les accents pour le filtrage
function removeAccents(str) {
    if (!str) return str;
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//Remplir le select dans le HTML
function remplirFiltres() {
    //Remplir les types
    let typesSet = new Set();
    pokemonsList.forEach(poke => {
        poke.getTypes().forEach(t => typesSet.add(t.type));
    });
    let typesTri = Array.from(typesSet).sort();
    let typeSelect = document.getElementById('type-filter');
    typesTri.forEach(type => {
        let option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });

    //Remplir les attaques rapides
    let attaquesSet = new Set();
    pokemonsList.forEach(poke => {
        poke._attaques_rapides_pokemon.forEach(a => attaquesSet.add(a.nom_attack));
    });
    let attaquesTri = Array.from(attaquesSet).sort();
    let attaqueSelect = document.getElementById('attaque-rapide-filter');
    attaquesTri.forEach(attaque => {
        let option = document.createElement('option');
        option.value = attaque;
        option.textContent = attaque;
        attaqueSelect.appendChild(option);
    });
}

function init() {
    pokemonsList = Object.values(Pokemon.all_pokemons);
    
    remplirFiltres();
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
        var totalPages = Math.ceil(filtrerListe().length / itemsPerPage);
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

    //Pour la partie filtrage
    document.getElementById('type-filter').addEventListener('change', function(e) {
        filtrage.type = e.target.value === "" ? null : e.target.value;
        currentPage = 1;
        updatePagination();
        renderTable();
    });

    document.getElementById('attaque-rapide-filter').addEventListener('change', function(e) {
        filtrage.attaqueRapide = e.target.value === "" ? null : e.target.value;
        currentPage = 1;
        updatePagination();
        renderTable();
    });

    document.getElementById('nom-filter').addEventListener('input', function(e) {
        filtrage.nom = e.target.value === "" ? null : e.target.value;
        currentPage = 1;
        updatePagination();
        renderTable();
    });

    //Pour la partie triage
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

function filtrerListe() {
    let result = [...pokemonsList];
    
    //Filtrage par type
    if (filtrage.type) {
        result = result.filter(poke => {
            return poke.getTypes().some(t => t.type === filtrage.type);
        });
    }
    
    //Filtrage par attaque rapide
    if (filtrage.attaqueRapide) {
        result = result.filter(poke => {
            return poke._attaques_rapides_pokemon.some(a => a.nom_attack === filtrage.attaqueRapide);
        });
    }
    
    //Filtrage par nom
    if (filtrage.nom) {
        let nomRecherche = removeAccents(filtrage.nom.toLowerCase());
        result = result.filter(poke => {
            let nomPokemon = removeAccents(poke._nom_pokemon.toLowerCase());
            return nomPokemon.includes(nomRecherche);
        });
    }
    
    return result;
}

function updatePagination() {
    var filteredPokemons = filtrerListe();
    var totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);
    if (totalPages === 0) totalPages = 1;
    
    //Ajuster la page courante si elle dépasse
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    document.getElementById('current-page').innerText = currentPage;
    document.getElementById('total-pages').innerText = totalPages;

    document.getElementById('btn-prec').disabled = (currentPage === 1);
    document.getElementById('btn-suiv').disabled = (currentPage === totalPages);
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

    var pokemonsFiltre = filtrerListe();
    var pokemonsTri = pokemonsFiltre.sort(trierListe);
    if(ascTri == false)
    {
        pokemonsTri = pokemonsTri.toReversed();
    }
    
    var start = (currentPage - 1) * itemsPerPage;
    var end = start + itemsPerPage;
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
        var formattedId = String(poke.id_pokemon).padStart(3, '0');
        img.src = "webp/images/" + formattedId + ".webp";
        img.alt = poke._nom_pokemon;
        img.addEventListener('mouseenter', function(e) {
            var popupImg = document.getElementById('image-popup-img');
            var trParent = e.target.closest('tr');
            var pokId = trParent.getAttribute('data-pokemon-id');
            var fId = String(pokId).padStart(3, '0');
            popupImg.src = "webp/images/" + fId + ".webp";
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
    html += '<img src="webp/images/' + formattedId + '.webp" alt="' + poke._nom_pokemon + '">';
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