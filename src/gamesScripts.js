import './gameStyles.css'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const games = ref([])
const loading = ref(true)
const ratingRange = ref([0, 100])
const originalGames = ref([])
const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedSortOrder = ref('');
const newGame = ref({
    game_title: '',
    developer: '',
    publisher: '',
    release_year: '',
    genres: ''
})
const editGame = ref({
    _id: '',
    game_title: '',
    developer: '',
    publisher: '',
    release_year: '',
    genres: ''
})


const sortGames = async (type) => {
    try {
        loading.value = true
        let url = ''

        if (type === 'best') {
            url = 'http://localhost:5000/api/stats/best-rated'
        } else if (type === 'worst') {
            url = 'http://localhost:5000/api/stats/worst-rated'
        }

        const response = await axios.get(url)
        games.value = response.data
    } catch (error) {
        console.error("Error fetching sorted games:", error)
    } finally {
        loading.value = false
    }
}

const toggleSortOrder = () => {
    if (selectedSortOrder.value === 'best') {
        sortGames('best');
    } else if (selectedSortOrder.value === 'worst') {
        sortGames('worst');
    }
};

const openAddGameModal = () => {
    isModalOpen.value = true
}

const closeAddGameModal = () => {
    isModalOpen.value = false
}

const openEditGameModal = (game) => {
    editGame.value = { ...game }
    isEditModalOpen.value = true
}

const closeEditGameModal = () => {
    isEditModalOpen.value = false
}

const submitNewGame = async () => {
    try {

        if (typeof newGame.value.genres === 'string') {
            newGame.value.genres = newGame.value.genres
                .split(',')
                .map(g => g.trim())
                .filter(Boolean);
        }

        const response = await axios.post('http://localhost:5000/api/games', newGame.value)
        games.value.push(response.data)
        closeAddGameModal()
        alert('Game added successfully!')
    } catch (error) {
        console.error('Error adding game:', error)
    }
}


const submitEditGame = async () => {
    try {

        const response = await axios.put(
            `http://localhost:5000/api/games/${editGame.value._id}`,
            editGame.value
        )

        const index = games.value.findIndex(game => game._id === editGame.value._id)
        if (index !== -1) {
            games.value[index] = response.data
        }
        closeEditGameModal()
        alert('Game updated successfully!')
    } catch (error) {
        console.error('Error updating game:', error)
    }
}


const filterByRating = () => {
    const [min, max] = ratingRange.value
    games.value = originalGames.value.filter(
        game => game.metacritic_rating >= min && game.metacritic_rating <= max
    )
}

const deleteGame = async (gameId) => {
    const confirmed = confirm('Are you sure you want to delete this game?')
    if (confirmed) {
        try {
            await axios.delete(`http://localhost:5000/api/games/${gameId}`)
            games.value = games.value.filter(game => game._id !== gameId)
        } catch (error) {
            console.error('Error deleting game:', error)
        }
    }
}

const handleSearch = async () => {
    loading.value = true
    try {
        const response = await axios.get(`http://localhost:5000/api/filter?search=${searchQuery.value}`)
        games.value = response.data
    }
    catch (error) {
        console.error('Error searching games:', error)
    }
    finally {
        loading.value = false
    }
}

const getRatingColor = (rating) => {
    if (rating >= 80) return 'bg-success'
    if (rating >= 60) return 'bg-warning'
    return 'bg-danger'
}


export {
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
    sortGames,
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
}