
document.addEventListener('DOMContentLoaded', () => {
  const pokemonListElement = document.getElementById('pokemonList');
  const searchInput = document.getElementById('search');

  // Récupérer la liste des Pokémon depuis le serveur
  fetch('/pokemon')
      .then(response => response.json())
      .then(pokemonList => {
          // Afficher la liste des Pokémon dans l'interface utilisateur
          pokemonList.forEach(pokemon => {
              const listItem = document.createElement('li');
              listItem.innerHTML = `<a href="pokemon-details.html?id=${pokemon.url.split('/').slice(-2, -1)}">${pokemon.name}</a>`;
              pokemonListElement.appendChild(listItem);
          });
      })
      .catch(error => {
          console.error('Erreur lors de la récupération de la liste des Pokémon:', error);
          pokemonListElement.innerHTML = 'Erreur lors de la récupération de la liste des Pokémon.';
      });

  // Gérer l'affichage des détails du Pokémon
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonId = urlParams.get('id');
  if (pokemonId) {
      fetch(`/pokemon/${pokemonId}`)
          .then(response => response.json())
          .then(pokemonDetails => {
              // Afficher les détails du Pokémon dans la page
              const pokemonNameElement = document.getElementById('pokemonName');
              const pokemonDetailsElement = document.getElementById('pokemonDetails');
              pokemonNameElement.textContent = pokemonDetails.name;
              pokemonDetailsElement.innerHTML = `
                  <p>Height: ${pokemonDetails.height}</p>
                  <p>Weight: ${pokemonDetails.weight}</p>
                  <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
              `;
          })
          .catch(error => {
              console.error(`Erreur lors de la récupération des détails du Pokémon avec l'ID ${pokemonId}:`, error);
              alert(`Erreur lors de la récupération des détails du Pokémon avec l'ID ${pokemonId}.`);
          });
  }

  // Fonction de recherche
  searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const pokemonItems = pokemonListElement.getElementsByTagName('li');
      Array.from(pokemonItems).forEach(item => {
          const pokemonName = item.textContent.toLowerCase();
          if (pokemonName.includes(searchTerm)) {
              item.style.display = 'block';
          } else {
              item.style.display = 'none';
          }
      });
  });
});

