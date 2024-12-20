// Estrutura para armazenar o estado de cada usuário
const userStates = {};

// Obtém o estado atual do usuário ou cria um novo
function getUserState(userId) {
  if (!userStates[userId]) {
    userStates[userId] = { flow: null, step: 0, data: {}, dateTime: new Date()};
  }
  return userStates[userId];
}

// Atualiza o estado do usuário
function updateUserState(userId, newState) {
  userStates[userId] = { ...userStates[userId], ...newState };
}

// Reinicia o estado do usuário (quando o fluxo termina ou é cancelado)
function resetUserState(userId) {
  delete userStates[userId];
}

module.exports = {
  getUserState,
  updateUserState,
  resetUserState,
};