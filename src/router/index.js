import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LeagueTable from '../views/LeagueTable.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/season/:season_id/classification', name: 'LeagueTable', component: LeagueTable }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
