import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../src/components/SignIn.vue'
import GameList from '../src/components/GameList.vue'

const routes = [
    { path: '/', component: SignIn, name: 'sign-in' },
    { path: '/game-list', component: GameList, name: 'game-list' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
