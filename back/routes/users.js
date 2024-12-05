var express = require('express');
var router = express.Router();
var User = require('../models/User');

// Dados fictícios de usuários
const usersReserva = [
  { id: 1, name: 'João Silva', email: 'joao.silva@email.com' },
  { id: 2, name: 'Maria Oliveira', email: 'maria.oliveira@email.com' },
  { id: 3, name: 'Carlos Sousa', email: 'carlos.sousa@email.com' },
];

// Endpoint para listar usuários
router.get('/', async function(req, res, next) {
  try {
    const usersBanco = await User.find(); // Busca todos os usuários no banco
    console.log(usersBanco);
    var users = usersBanco ? usersBanco : usersReserva;
    res.json(users);
  } catch (error) {
    next(error); // Passa o erro para o próximo middleware
  }
});
module.exports = router;
