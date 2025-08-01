<template>
  <div class="season-matches">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando partidos...</p>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="matches-container">
      <div class="matches-header">
        <h1 class="matches-title">Partidos de la Temporada</h1>
        <button class="classification-button" @click="goToClassification">
          Ver Clasificación
        </button>
      </div>
      
      <div class="matches-list">
        <div 
          v-for="match in sortedMatches" 
          :key="match.ID" 
          :class="['match-card', { 'played': isMatchPlayed(match), 'unplayed': !isMatchPlayed(match) }]"
        >
          <div class="match-date">
            {{ formatMatchDate(match.MatchDate) }}
          </div>
          
          <div class="match-teams">
            <div class="team home-team">
              <div class="team-badge"></div>
              <span class="team-name">{{ getTeamName(match.HomeTeamID) }}</span>
            </div>
            
            <div class="match-score">
              <template v-if="isMatchPlayed(match)">
                <span class="score">{{ match.HomeResult }} - {{ match.AwayResult }}</span>
              </template>
              <template v-else>
                <span class="vs">VS</span>
              </template>
            </div>
            
            <div class="team away-team">
              <span class="team-name">{{ getTeamName(match.AwayTeamID) }}</span>
              <div class="team-badge"></div>
            </div>
          </div>
          
          <div class="match-actions">
            <button 
              v-if="isMatchPlayed(match)" 
              class="view-button"
              @click="viewMatchDetails(match.ID)"
            >
              Ver
            </button>
            <button 
              v-else 
              class="play-button"
              @click="handlePlayMatch(match.ID)"
              :disabled="playingMatch === match.ID"
            >
              {{ playingMatch === match.ID ? 'Jugando...' : 'Jugar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchSeasonMatches, playMatch } from '../services/matches'

export default {
  name: 'SeasonMatches',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const matches = ref([])
    const playingMatch = ref(null)

    const loadSeasonMatches = async () => {
      try {
        loading.value = true
        error.value = null
        const result = await fetchSeasonMatches(route.params.season_id)
        matches.value = result
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const sortedMatches = computed(() => {
      return [...matches.value].sort((a, b) => {
        const dateA = new Date(a.MatchDate)
        const dateB = new Date(b.MatchDate)
        return dateB - dateA
      })
    })

    const isMatchPlayed = (match) => {
      return match.HomeResult !== null && match.AwayResult !== null
    }

    const formatMatchDate = (dateString) => {
      const date = new Date(dateString)
      if (date.getFullYear() === 1) {
        return 'Fecha por determinar'
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getTeamName = (teamId) => {
      return `Equipo ${teamId.substring(0, 8)}`
    }

    const viewMatchDetails = (matchId) => {
      router.push(`/match/${matchId}?season_id=${route.params.season_id}`)
    }

    const goToClassification = () => {
      router.push(`/season/${route.params.season_id}/classification`)
    }

    const handlePlayMatch = async (matchId) => {
      try {
        playingMatch.value = matchId
        await playMatch(route.params.season_id, matchId)
        router.push(`/match/${matchId}?season_id=${route.params.season_id}`)
      } catch (err) {
        error.value = `Error al jugar el partido: ${err.message}`
        playingMatch.value = null
      }
    }

    onMounted(() => {
      loadSeasonMatches()
    })

    return {
      loading,
      error,
      matches,
      sortedMatches,
      isMatchPlayed,
      formatMatchDate,
      getTeamName,
      viewMatchDetails,
      goToClassification,
      handlePlayMatch,
      playingMatch
    }
  }
}
</script>

<style scoped>
.season-matches {
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

.matches-container {
  max-width: 800px;
  margin: 0 auto;
}

.matches-header {
  text-align: center;
  margin-bottom: 30px;
}

.matches-title {
  color: var(--color-text);
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 15px;
}

.classification-button {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.classification-button:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.match-card.played {
  border-left: 4px solid #27ae60;
}

.match-card.unplayed {
  border-left: 4px solid #f39c12;
}

.match-date {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 15px;
  font-weight: 500;
}

.match-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.team {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.home-team {
  justify-content: flex-start;
}

.away-team {
  justify-content: flex-end;
  flex-direction: row-reverse;
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
  font-size: 1.1em;
}

.match-score {
  flex: 0 0 auto;
  text-align: center;
  margin: 0 20px;
}

.score {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
}

.vs {
  font-size: 1.2em;
  font-weight: bold;
  color: #95a5a6;
}

.match-actions {
  text-align: center;
}

.view-button {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background: linear-gradient(135deg, #229954, #27ae60);
  transform: translateY(-1px);
}

.match-status {
  color: #f39c12;
  font-weight: 600;
  font-size: 0.9em;
}

.play-button {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #e67e22, #d35400);
  transform: translateY(-1px);
}

.play-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .matches-title {
    font-size: 2em;
  }
  
  .classification-button {
    padding: 10px 20px;
    font-size: 0.9em;
  }
  
  .match-card {
    padding: 15px;
  }
  
  .match-teams {
    flex-direction: column;
    gap: 15px;
  }
  
  .team {
    width: 100%;
    justify-content: center !important;
  }
  
  .away-team {
    flex-direction: row !important;
  }
  
  .match-score {
    margin: 0;
    order: -1;
  }
  
  .team-name {
    font-size: 1em;
  }
}
</style>