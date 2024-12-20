const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const { findUserByPhone } = require('../models/User');
const { getUserState, updateUserState } = require('../state/stateManager');
const { handleAddDishStep } = require('../handlers/addDishHandler');
const { handleListDishes } = require('../handlers/listDishHandler');

// Configura o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/chromium-browser', // Caminho para o Google Chrome ou Chromium
  },
});

const timers = {}; // Armazena os timers para cada usuário

function initializeWhatsAppClient() {
  client.once('ready', () => {
    console.log('WhatsApp client is ready!');
  });

  client.on('qr', (qr) => {
    console.log('QR code received, scan using WhatsApp app:');
    qrcode.generate(qr, { small: true });
  });

  client.on('message_create', async (msg) => {
    const userId = msg.from;
    const userState = getUserState(userId);
    const user = await buscarUsuario(msg.author);
    console.log('teste: ', user);
    if (user) {
      if (timers[userId]) {
        clearTimeout(timers[userId]);
        delete timers[userId];
      }

      const sendInitialMessage = () => {
        client.sendMessage(userId, 'Por favor, escolha uma opção válida');
        updateUserState(userId, { flow: null, step: 0, dateTime: null });
      };

      if (!userState.flow) {
        if (msg.body && !userState.await) {
          client.sendMessage(userId, `Bom dia ${user.name}, escolha uma das opções:\n1. Adicionar prato\n2. Listar pratos`);
          updateUserState(userId, { flow: null, step: 0, dateTime: new Date(), await: true });
          // Configura o timer para resetar o estado após 30 segundos
          timers[userId] = setTimeout(() => {
            sendInitialMessage();
          }, 30000);
        } else if (msg.body === '1') {
          client.sendMessage(userId, 'Você escolheu adicionar um prato.');
          updateUserState(userId, { flow: 'addDish', step: 0, data: {dish:{}}, dateTime: new Date() });
          handleAddDishStep(msg, client);
        } else if (msg.body === '2') {
          client.sendMessage(userId, 'Você escolheu listar os pratos.');
          updateUserState(userId, { flow: 'listDishes', step: 0, dateTime: new Date() });
          handleListDishes(msg, client);
        } else {
          client.sendMessage(userId, 'Por favor, escolha uma opção válida');
        }
      } else {
          if (userState.flow === 'addDish') {
            handleAddDishStep(msg, client);
          } else if (userState.flow === 'listDishes') {
            handleListDishes(msg, client);
          }
      }

    }
  });

  client.on('auth_failure', (message) => {
    console.error('Authentication failed:', message);
  });

  client.on('disconnected', (reason) => {
    console.log('WhatsApp client was disconnected:', reason);
  });

  client.initialize();
}

async function buscarUsuario(phone) {
  try {
    const usuario = await findUserByPhone(phone);
    if (usuario) {
      console.log('Usuário encontrado:', usuario);
      return usuario;
    } else {
      console.log('Usuário não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
  }
}

module.exports = { initializeWhatsAppClient, client };
