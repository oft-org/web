<template>
  <div class="match-details">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Cargando detalles del partido...</p>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="match-container">
      <!-- Navigation Button -->
      <div class="navigation-section">
        <button class="classification-button" @click="goToClassification">
          Ver Clasificación
        </button>
      </div>
      
      <!-- Scoreboard -->
      <div class="scoreboard">
        <div class="team home-team">
          <div class="team-badge"></div>
          <h2 class="team-name">{{ matchData.home_team.name }}</h2>
        </div>
        
        <div class="score-display">
          <div class="score">
            <span class="home-score">{{ matchData.home_result }}</span>
            <span class="separator">-</span>
            <span class="away-score">{{ matchData.away_result }}</span>
          </div>
          <div class="match-status">Final</div>
        </div>
        
        <div class="team away-team">
          <h2 class="team-name">{{ matchData.away_team.name }}</h2>
          <div class="team-badge"></div>
        </div>
      </div>

      <!-- Match Events Timeline -->
      <div class="events-section">
        <h3 class="events-title">Desarrollo del Partido</h3>
        <div class="timeline">
          <div 
            v-for="event in sortedEvents" 
            :key="event.id"
            :class="['timeline-event', getEventClass(event.event_type)]"
          >
            <div class="event-minute">{{ event.minute }}'</div>
            <div class="event-content">
              <div class="event-header">
                <span class="event-icon">{{ getEventDisplay(event.event_type).icon }}</span>
                <span class="event-title">{{ getEventDisplay(event.event_type).text }}</span>
              </div>
              <p class="event-description">{{ getEventDisplay(event.event_type).description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchMatchDetails } from '../services/matches'
import { getEventDisplay } from '../utils/eventTranslations'

export default {
  name: 'MatchDetails',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const matchData = ref(null)

    const loadMatchDetails = async () => {
      try {
        loading.value = true
        error.value = null
        const result = await fetchMatchDetails(route.params.match_id)
        matchData.value = result
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const sortedEvents = computed(() => {
      if (!matchData.value?.events) return []
      return [...matchData.value.events].sort((a, b) => a.minute - b.minute)
    })

    const getEventClass = (eventType) => {
      const importantEvents = ['GOAL', 'RED_CARD', 'GREAT_SCORING_CHANCE', 'END_OF_THE_MATCH', 'MATCH_BREAK']
      return importantEvents.includes(eventType) ? 'important-event' : 'regular-event'
    }

    const goToClassification = () => {
      // Check if we have access to season_id from route params or match data
      const seasonId = route.query.season_id
      if (seasonId) {
        router.push(`/season/${seasonId}/classification`)
      } else {
        // Fallback: navigate to home if we don't have season_id
        router.push('/')
      }
    }

    onMounted(() => {
      loadMatchDetails()
    })

    return {
      loading,
      error,
      matchData,
      sortedEvents,
      getEventDisplay,
      getEventClass,
      goToClassification
    }
  }
}
</script>

<style scoped>
.match-details {
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

.match-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Navigation Section */
.navigation-section {
  text-align: center;
  margin-bottom: 30px;
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

/* Scoreboard Styles */
.scoreboard {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  color: white;
}

.team {
  display: flex;
  align-items: center;
  gap: 15px;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  flex-shrink: 0;
}

.team-name {
  font-size: 1.4em;
  font-weight: bold;
  margin: 0;
}

.score-display {
  text-align: center;
  flex: 0 0 auto;
  margin: 0 30px;
}

.score {
  font-size: 3.5em;
  font-weight: bold;
  margin-bottom: 10px;
}

.separator {
  margin: 0 15px;
  opacity: 0.7;
}

.match-status {
  font-size: 1em;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Events Timeline Styles */
.events-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.events-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 30px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #3498db, #2ecc71);
}

.timeline-event {
  position: relative;
  margin-bottom: 25px;
  padding-left: 40px;
}

.timeline-event::before {
  content: '';
  position: absolute;
  left: -23px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #95a5a6;
}

.important-event::before {
  background: #e74c3c;
  width: 16px;
  height: 16px;
  left: -25px;
  top: 6px;
}

.regular-event::before {
  background: #3498db;
}

.event-minute {
  position: absolute;
  left: -80px;
  top: 5px;
  background: #34495e;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9em;
  min-width: 35px;
  text-align: center;
}

.event-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #3498db;
}

.important-event .event-content {
  border-left-color: #e74c3c;
  background: #fdf2f2;
}

.event-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.event-icon {
  font-size: 1.2em;
}

.event-title {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1em;
}

.event-description {
  color: #7f8c8d;
  margin: 0;
  font-style: italic;
}

@media (max-width: 768px) {
  .classification-button {
    padding: 10px 20px;
    font-size: 0.9em;
  }
  
  .scoreboard {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .team {
    justify-content: center !important;
    flex-direction: row !important;
  }
  
  .score-display {
    margin: 0;
  }
  
  .score {
    font-size: 2.5em;
  }
  
  .team-name {
    font-size: 1.2em;
    text-align: center;
  }
  
  .timeline {
    padding-left: 20px;
  }
  
  .event-minute {
    position: static;
    display: inline-block;
    margin-bottom: 10px;
  }
  
  .timeline-event {
    padding-left: 20px;
  }
}
</style>