<template>
  <div class="sign-in-container">
    <h1 class="text-center mb-4">🎮 Game Library</h1>
    <form @submit.prevent="handleSignIn">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" v-model="username" placeholder="Enter your username" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password" placeholder="Enter your password" required />
      </div>
      <div class="d-grid gap-2">
        <button type="submit" class="btn btn-primary">Sign In</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const router = useRouter()

const handleSignIn = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      login: username.value,
      password: password.value
    })

    if (response.status === 200) {

      localStorage.setItem('user_id', response.data.userId)
      localStorage.setItem('user_status', response.data.userStatus)

      await router.push({name: 'game-list'})
    }
    else {

      alert('Invalid credentials')
    }
  }
  catch (error) {
    console.error('Error logging in:', error)
    alert('An error occurred during login')
  }
}
</script>

<style scoped>
.sign-in-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
body {
  background-color: #f4f4f4;
}
</style>
