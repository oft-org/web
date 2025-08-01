export const eventTranslations = {
  'LONG_SHOT': {
    text: 'Disparo de larga distancia',
    icon: '🎯',
    description: 'Un jugador intenta anotar desde fuera del área'
  },
  'CORNER_KICK': {
    text: 'Saque de esquina',
    icon: '⚡',
    description: 'El balón sale por la línea de fondo y se concede córner'
  },
  'KEY_PASS': {
    text: 'Pase clave',
    icon: '🎪',
    description: 'Un pase que genera una oportunidad de gol'
  },
  'GREAT_SCORING_CHANCE': {
    text: 'Gran ocasión de gol',
    icon: '🔥',
    description: 'Una oportunidad clara de marcar'
  },
  'MATCH_BREAK': {
    text: 'Descanso',
    icon: '⏸️',
    description: 'Final del primer tiempo'
  },
  'SHOT': {
    text: 'Disparo',
    icon: '⚽',
    description: 'Un jugador dispara hacia la portería'
  },
  'DRIBBLE': {
    text: 'Regate',
    icon: '💨',
    description: 'Un jugador supera a su rival con habilidad'
  },
  'END_OF_THE_MATCH': {
    text: 'Final del partido',
    icon: '🏁',
    description: 'El árbitro pita el final del encuentro'
  },
  'GOAL': {
    text: 'Gol',
    icon: '⚽',
    description: 'Se marca un gol'
  },
  'YELLOW_CARD': {
    text: 'Tarjeta amarilla',
    icon: '🟨',
    description: 'El árbitro muestra tarjeta amarilla'
  },
  'RED_CARD': {
    text: 'Tarjeta roja',
    icon: '🟥',
    description: 'El árbitro muestra tarjeta roja'
  },
  'SUBSTITUTION': {
    text: 'Cambio',
    icon: '🔄',
    description: 'Se produce un cambio de jugador'
  }
}

export function getEventDisplay(eventType) {
  return eventTranslations[eventType] || {
    text: eventType,
    icon: '❓',
    description: 'Evento desconocido'
  }
}