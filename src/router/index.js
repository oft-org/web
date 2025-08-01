import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LeagueTable from '../views/LeagueTable.vue'
import SeasonMatches from '../views/SeasonMatches.vue'
import MatchDetails from '../views/MatchDetails.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/season/:season_id/classification', name: 'LeagueTable', component: LeagueTable },
  { path: '/season/:season_id/matches', name: 'SeasonMatches', component: SeasonMatches },
  { path: '/match/:match_id', name: 'MatchDetails', component: MatchDetails }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
