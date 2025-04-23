<template>
  <header class="p-3 bg-dark text-white text-center">
    <h1>Game Explorer</h1>
    
  </header>
  <div id="searchInput" class="container mt-4 d-flex justify-content-center">
    <div class="input-group">
      <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          class="form-control"
          placeholder="Search games..."
      />
      <button @click="handleSearch" class="btn btn-primary">
        Search
      </button>
    </div>
    <div v-if="isAdmin" class="mt-3">
      <button @click="openAddGameModal" class="btn btn-success">Add New Game</button>
    </div>
    <div class="container mt-5">
      <div class="dropdown">
        <select id="sorting-orders" class="form-control" v-model="selectedSortOrder" @change="toggleSortOrder">
          <option value="">-- Select a Sorting --</option>
          <option value="best">Best Rated</option>
          <option value="worst">Worst Rated</option>
        </select>
      </div>
    </div>

    <div class="container mt-5">
      <div class="dropdown">
        <select id="game-stats" class="form-control" v-model="selectedStats" @change="toggleStats">
          <option value="">-- Select Statistics--</option>
          <option value="developers">For developers</option>
          <option value="publishers">For publishers</option>
        </select>
      </div>
    </div>
  </div>

  <div class="container my-3">
    <label class="form-label fw-bold">Filter by Rating ({{ ratingRange[0] }} - {{ ratingRange[1] }})</label>
    <div class="d-flex align-items-center">
      <input
          type="range"
          class="form-range me-2"
          min="0"
          max="100"
          step="1"
          v-model="ratingRange[0]"
          @change="filterByRating"
      />
      <input
          type="range"
          class="form-range"
          min="0"
          max="100"
          step="1"
          v-model="ratingRange[1]"
          @change="filterByRating"
      />
    </div>
  </div>

  
  <div v-if="isModalOpen" class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Add New Game</h5>
          <button type="button" class="close" @click="closeAddGameModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitNewGame">
            
            <div class="mb-3">
              <label for="gameTitle" class="form-label">Game Title</label>
              <input type="text" v-model="newGame.game_title" id="gameTitle" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="developer" class="form-label">Developer</label>
              <input type="text" v-model="newGame.developer" id="developer" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="publisher" class="form-label">Publisher</label>
              <input type="text" v-model="newGame.publisher" id="publisher" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="releaseYear" class="form-label">Rating (Metacritic)</label>
              <input type="number" v-model="newGame.metacritic_rating" id="metacriticRating" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="releaseYear" class="form-label">Release Year</label>
              <input type="number" v-model="newGame.release_year" id="releaseYear" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="genres" class="form-label">Genres</label>
              <input type="text" v-model="newGame.genres" id="genres" class="form-control" placeholder="Comma separated" />
            </div>
            <button type="submit" class="btn btn-primary">Add Game</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  
  <div v-if="isEditModalOpen" class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Game</h5>
          <button type="button" class="close" @click="closeEditGameModal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitEditGame">
            <div class="mb-3">
              <label for="editGameTitle" class="form-label">Game Title</label>
              <input type="text" v-model="editGame.game_title" id="editGameTitle" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="editDeveloper" class="form-label">Developer</label>
              <input type="text" v-model="editGame.developer" id="editDeveloper" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="editPublisher" class="form-label">Publisher</label>
              <input type="text" v-model="editGame.publisher" id="editPublisher" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="editMetacriticRating" class="form-label">Rating (Metacritic)</label>
              <input type="number" v-model="editGame.metacritic_rating" id="editMetacriticRating" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="editReleaseYear" class="form-label">Release Year</label>
              <input type="number" v-model="editGame.release_year" id="editReleaseYear" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="editGenres" class="form-label">Genres</label>
              <input type="text" v-model="editGame.genres" id="editGenres" class="form-control" placeholder="Comma separated" />
            </div>
            <button type="submit" class="btn btn-primary">Update Game</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    
    <h2 class="text-center"></h2>

    
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    
    <div v-else-if="games.length === 0" class="alert alert-info text-center">
      No games found.
    </div>

    <div v-if="showingStats" class="container mt-4">
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="table-primary">
          <tr>
            <th>Name</th>
            <th>Games</th>
            <th>Average Rating</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="stat in devPubStats" :key="stat.name">
            <td><strong>{{ stat._id }}</strong></td>
            <td>
              <ul class="mb-0">
                <p class="mb-1">{{ stat.games_amount }}</p>
              </ul>
            </td>
            <td><span :class="getRatingColor(stat.average_rating)">{{ stat.average_rating.toFixed(1) }}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    
    <div v-else class="row row-cols-1 g-4">
      <div v-for="game in games" :key="game._id" class="col">
        <div class="card h-100 border-primary shadow position-relative game-card" style="border-radius: 10px; background-color: #f8f9fa;">

          <div
              class="rating-circle text-white d-inline-flex align-items-center justify-content-center position-absolute"
              :class="getRatingColor(game.metacritic_rating)"
              style="top: 20px; right: 20px;"
          >
            {{ game.metacritic_rating }}
          </div>

          <div class="card-body">
            <h5 class="card-title text-primary fw-bold">
              {{ game.game_title }}
              <span class="text" style="font-weight: bold">({{ game.release_year }})</span>
            </h5>
            <p class="mb-2">
              <span
                  v-for="genre in game.genres"
                  :key="genre"
                  class="badge bg-secondary me-1"
              >
                {{ genre }}
              </span>
            </p>
            <p class="mb-1"><strong>Developer:</strong> {{ game.developer }}</p>
            <p class="mb-1"><strong>Publisher:</strong> {{ game.publisher }}</p>

            
            <div v-if="isAdmin" class="game-actions position-absolute">
              <button class="btn btn-warning me-2" @click="openEditGameModal(game)">Edit</button>
              <button class="btn btn-danger" @click="deleteGame(game._id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import io from 'socket.io-client'
const socket = io('http://localhost:5000');


onMounted(() => {

  fetchGames();

  socket.on('connect', () => {
    console.log('Socket connected!', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('gameAdded', () => {fetchGames();});

  socket.on('gameUpdated', () => {fetchGames();});

  socket.on('gameDeleted', () => {fetchGames();});
})

onUnmounted(() => {

    socket.off('gameAdded');
    socket.off('gameUpdated');
    socket.off('gameDeleted');

})

import {

  games,
  loading,
  ratingRange,
  originalGames,
  searchQuery,
  isModalOpen,
  isEditModalOpen,
  selectedSortOrder,
  newGame,
  editGame,
  toggleSortOrder,
  openAddGameModal,
  closeAddGameModal,
  openEditGameModal,
  closeEditGameModal,
  submitNewGame,
  submitEditGame,
  filterByRating,
  deleteGame,
  handleSearch,
  getRatingColor

} from '@/gamesScripts'
import {useEffect} from "react";

const devPubStats = ref([])
const showingStats = ref(false)
const selectedStats = ref('');
const isAdmin = (localStorage.getItem('user_status') === 'true')

const fetchGames = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/games')
    games.value = response.data
    originalGames.value = response.data
  } catch (error) {
    console.error("Error fetching games:", error)
  } finally {
    loading.value = false
  }
}

const toggleStats = async () => {

  if (selectedStats.value === 'developers') {
    showingStats.value = true
    await fetchDevPubStats('developers')
  }
  else if (selectedStats.value === 'publishers') {
    showingStats.value = true
    await fetchDevPubStats('publishers')
  }
  else {
    showingStats.value = false
  }
}

const fetchDevPubStats = async (type) => {
  try {
    loading.value = true;
    const url = `http://localhost:5000/api/stats/${type}`;
    const response = await axios.get(url);
    devPubStats.value = response.data;
    console.log(devPubStats.value);
  } catch (error) {
    console.error(`Error fetching ${type} stats:`, error);
  } finally {
    loading.value = false;
  }
}

</script>