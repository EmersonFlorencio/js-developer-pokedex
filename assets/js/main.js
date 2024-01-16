const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.querySelector("dialog");

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
    <div 
        id="${pokemon.name}"
    >
        <li 
            class="pokemon ${pokemon.type}"
        >
            <span class="number">#${pokemon.number}</span>
            <span 
                onclick="addEventClickToTheLi(event)" 
                style="cursor: pointer"
                class="name">${pokemon.name}
            </span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    </div>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
});

function PokemonModalDetails(pokemon) {
    return `
    <section>
    <button onclick="closeModal()">X</button>
    <li 
        class="pokemon ${pokemon.type}"
        id="${pokemon.name}"
    >
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <img src="${pokemon.photo}"
                 alt="${pokemon.name}">
        </div>

        </li>
        <div>
        <p>Habilidades</p>
            ${pokemon.abilities
            .map((ability) =>
                `<div>
                    <span>${ability}</span>
                </div>
                `)
            .join('')}
        </div>
            <p>Peso</p> 
            <p>${pokemon.weight} Lbs</p>
        </div>
        </div>
            <p>Status do Pokemon</p> 
            ${pokemon.stats.map((status) =>
                `
            <div>
                <p>${status.stat.name}</p>
                <p>${status.base_stat}</p>
            </div>
              `)
            .join('')}
        </div>
    </section>
`
}

function closeModal() {
    modal.close()
}

async function addEventClickToTheLi(event) {
    const pokemonName = event.target;


    const pokemon = await pokeApi.getDetailsPokemonsToModal(pokemonName.innerHTML);
    modal.innerHTML = PokemonModalDetails(pokemon)
    modal.showModal()

    closeModal
}


