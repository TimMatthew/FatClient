
function updateMinRatingValue() {
    document.getElementById("minRatingValue").textContent = document.getElementById("minRating").value;
}


function updateMaxRatingValue() {
    document.getElementById("maxRatingValue").textContent = document.getElementById("maxRating").value;
}


async function fetchGames() {
    const search = document.getElementById("searchInput").value.trim();
    const minRate = document.getElementById("minRating").value;
    const maxRate = document.getElementById("maxRating").value;

    const queryParams = new URLSearchParams();

    if (search) {
        queryParams.append('search', search);
    }
    if (minRate) {
        queryParams.append('minRate', minRate);
    }
    if (maxRate) {
        queryParams.append('maxRate', maxRate);
    }

    let url = "http://localhost:5000/api/filter?";

    if (queryParams.has('search')) {
        url += `search=${encodeURIComponent(search)}&`;
    }
    if (queryParams.has('minRate')) {
        url += `minRate=${minRate}&`;
    }
    if (queryParams.has('maxRate')) {
        url += `maxRate=${maxRate}&`;
    }

    
    url = url.endsWith('&') ? url.slice(0, -1) : url;

    console.log(url);  

    try {
        const res = await fetch(url);
        const games = await res.json();
        renderGames(games);
    } catch (err) {
        console.error("Error fetching games:", err);
        document.getElementById("gamesList").innerHTML = `<p class="text-danger">Failed to load games.</p>`;
    }
}


function renderGames(games) {
    const container = document.getElementById("gamesList");
    container.innerHTML = "";

    if (games.length === 0) {
        container.innerHTML = "<p>No games found.</p>";
        return;
    }

    games.forEach(game => {
        const rating = game.metacritic_rating;
        let ratingColor = "bg-danger";

        if (rating >= 80) ratingColor = "bg-success";
        else if (rating >= 50) ratingColor = "bg-warning";

        const gameCard = `
      <div id="${game._id}" class="game-card mx-auto mb-4">
        <div class="card shadow-sm w-100">
          <div class="card-body d-flex flex-column position-relative">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">${game.game_title} <small>(${game.release_year})</small></h5>
              <div class="rounded-circle ${ratingColor} text-white d-flex justify-content-center align-items-center" 
                   style="width: 40px; height: 40px; font-weight: bold;">
                ${rating}
              </div>
            </div>
            <p class="card-text">
              <strong>Developer:</strong> ${game.developer}<br>
              <strong>Publisher:</strong> ${game.publisher}<br>
              <strong>Genres:</strong> ${game.genres.join(", ")}
            </p>

            <div class="position-absolute bottom-0 end-0 m-3">
                <button class="btn btn-warning btn-sm" onclick="editGame('${game._id}')">Edit</button>
                <button class="btn btn-danger btn-sm ms-2" onclick="deleteGame('${game._id}')">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `;
        container.innerHTML += gameCard;
    });
}



function editGame(gameId) {
    console.log(`Edit game with ID: ${gameId}`);
    
}


function deleteGame(gameId) {
    console.log(`Delete game with ID: ${gameId}`);
    
}


window.onload = () => { fetchGames(); }
