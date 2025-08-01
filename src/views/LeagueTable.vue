<template>
  <div class="league-table">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando clasificación...</p>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="table-container">
      <div class="tournament-header">
        <h1 class="table-title">
          <span class="country-flag">{{ countryFlag }}</span>
          {{ tournamentName }}
        </h1>
        <button class="matches-button" @click="goToMatches">
          Ver Partidos
        </button>
      </div>
      <table class="classification-table">
        <thead>
          <tr>
            <th class="pos-column">POS</th>
            <th class="team-column">EQUIPO</th>
            <th class="stats-column">PTS</th>
            <th class="stats-column">GF</th>
            <th class="stats-column">GC</th>
            <th class="stats-column">DG</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in teams" :key="team.team_id" :class="getPositionClass(team.position)">
            <td class="position-cell">
              <span class="position-number">{{ team.position }}</span>
            </td>
            <td class="team-cell">
              <div class="team-info">
                <div class="team-badge"></div>
                <span class="team-name">{{ team.team_name }}</span>
              </div>
            </td>
            <td class="points-cell">
              <span class="points-value">{{ team.points }}</span>
            </td>
            <td class="goals-cell">{{ team.goals_for }}</td>
            <td class="goals-cell">{{ team.goals_against }}</td>
            <td class="goal-diff-cell" :class="{ 'positive': team.goal_difference > 0, 'negative': team.goal_difference < 0 }">
              {{ team.goal_difference > 0 ? '+' : '' }}{{ team.goal_difference }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchClassification } from '../services/classification'
import { getCountryFlag } from '../utils/countryFlags'

export default {
  name: 'LeagueTable',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const data = ref([])

    const loadClassification = async () => {
      try {
        loading.value = true
        error.value = null
        const result = await fetchClassification(route.params.season_id)
        data.value = result
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const getPositionClass = (position) => {
      if (position <= 3) return 'top-positions'
      if (position >= 18) return 'relegation-positions'
      return 'safe-positions'
    }

    const tournamentName = computed(() => {
      return data.value[0]?.tournament_name || 'Clasificación de la Liga'
    })

    const countryFlag = computed(() => {
      const countryCode = data.value[0]?.country
      return countryCode ? getCountryFlag(countryCode) : ''
    })

    const teams = computed(() => {
      return data.value[0]?.Teams || []
    })

    const goToMatches = () => {
      router.push(`/season/${route.params.season_id}/matches`)
    }

    onMounted(() => {
      loadClassification()
    })

    return {
      loading,
      error,
      data,
      getPositionClass,
      tournamentName,
      countryFlag,
      teams,
      goToMatches
    }
  }
}
</script>

<style scoped>
.league-table {
  padding: 20px;
  background-color: var(--color-secondary);
  min-height: 100vh;
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--color-text);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 20px;
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
  margin: 20px auto;
  max-width: 500px;
}

.table-container {
  max-width: 900px;
  margin: 0 auto;
}

.tournament-header {
  text-align: center;
  margin-bottom: 30px;
}

.table-title {
  color: var(--color-text);
  font-size: 2.5em;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.country-flag {
  font-size: 1.2em;
}

.matches-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.matches-button:hover {
  background: linear-gradient(135deg, #2980b9, #1f5f8b);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.classification-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.classification-table th {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 16px 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9em;
}

.pos-column {
  width: 60px;
}

.team-column {
  width: 40%;
  text-align: left !important;
}

.stats-column {
  width: 12%;
}

.classification-table td {
  padding: 16px 12px;
  text-align: center;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.2s ease;
}

.classification-table tr:hover {
  background-color: #f8f9fa;
}

.position-cell {
  font-weight: bold;
  font-size: 1.1em;
}

.position-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background-color: #95a5a6;
  color: white;
  font-size: 0.9em;
}

.team-cell {
  text-align: left !important;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  flex-shrink: 0;
}

.team-name {
  font-weight: 600;
  color: #2c3e50;
}

.points-cell {
  font-weight: bold;
  color: #27ae60;
}

.points-value {
  font-size: 1.1em;
}

.goals-cell {
  color: #7f8c8d;
  font-weight: 500;
}

.goal-diff-cell {
  font-weight: bold;
}

.goal-diff-cell.positive {
  color: #27ae60;
}

.goal-diff-cell.negative {
  color: #e74c3c;
}

.top-positions {
  border-left: 4px solid #27ae60;
}

.top-positions .position-number {
  background-color: #27ae60;
}

.relegation-positions {
  border-left: 4px solid #e74c3c;
}

.relegation-positions .position-number {
  background-color: #e74c3c;
}

.safe-positions .position-number {
  background-color: #3498db;
}

.classification-table tr:last-child td {
  border-bottom: none;
}

@media (max-width: 768px) {
  .table-title {
    font-size: 2em;
    flex-direction: column;
    gap: 10px;
  }
  
  .country-flag {
    font-size: 1.5em;
  }
  
  .matches-button {
    padding: 10px 20px;
    font-size: 0.9em;
  }
  
  .classification-table th,
  .classification-table td {
    padding: 12px 8px;
    font-size: 0.9em;
  }
  
  .team-name {
    font-size: 0.9em;
  }
  
  .team-badge {
    width: 28px;
    height: 28px;
  }
}
</style>