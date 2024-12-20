const { updateUserState, getUserState, resetUserState } = require('../state/stateManager');
const Dish = require('../models/Dish');
const fs = require('fs');
const path = require('path');


async function handleAddDishStep(message, client) {
  const userId = message.from;
  const userState = getUserState(userId);

  switch (userState.step) {
    case 0:
      client.sendMessage(userId, 'Qual o nome do prato?');
      updateUserState(userId, { flow: 'addDish', step: 1 });
      break;
    case 1:
      userState.data.dish.name = message.body;
      client.sendMessage(userId, `Qual o Descrição para: "${userState.data.dish.name}"?  \n (Pode ser um texto)`);
      updateUserState(userId, { step: 2 });
      break;
    case 2:
      userState.data.dish.description = message.body;
      client.sendMessage(userId, `Qual o preço para: "${userState.data.dish.name}"?  \n (Coloque o valor em reais)`);
      updateUserState(userId, { step: 3 });
      break;
    case 3:
      const price = parseFloat(message.body.replace(',', '.'));
      if (isNaN(price) || price <= 0) {
        client.sendMessage(userId, 'Por favor, insira um preço válido (somente números).');
        break;
      }
      userState.data.dish.price = price;
      // client.sendMessage(
      //   userId,
      //   `Confirme as informações do prato:\n\n*Nome:* ${userState.data.dish.name}\n*Descrição:* ${userState.data.dish.description}\n*Preço:* R$ ${userState.data.dish.price.toFixed(2)}\n\nDigite *1* para confirmar ou *2* para cancelar.`
      // );
      client.sendMessage(userId, 'Coloque uma imagem.');
      updateUserState(userId, { step: 4 });
      break;
    case 4:
      if (message.hasMedia) {
        const media = await message.downloadMedia();
        saveImage(media, userState.data.dish.name);
        updateUserState(userId, { step: 5 });
      }
      break;
    case 5:
      if (message.body === '1') {
        createDish(userState.data.dish)
          .then(() => client.sendMessage(userId, 'Prato cadastrado com sucesso! 🎉'))
          .catch((error) => {
            console.error('Erro ao cadastrar prato:', error);
            client.sendMessage(userId, 'Houve um erro ao cadastrar o prato. Tente novamente mais tarde.');
          });
        resetUserState(userId);
      } else if (message.body === '2') {
        client.sendMessage(userId, 'Cadastro do prato cancelado.');
        resetUserState(userId);
      } else {
        client.sendMessage(userId, 'Opção inválida. Digite *1* para confirmar ou *2* para cancelar.');
      }
      break;
    default:
      client.sendMessage(userId, 'Erro no fluxo. Tente novamente.');
      resetUserState(userId);
      break;
  }
}

async function saveImage(media, filename) {
  try {
      const folderPath = path.join(__dirname, '../assets/images');
      if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
      }
      const filePath = path.join(folderPath, `${filename}.jpeg`);
      fs.writeFileSync(filePath, media.data, { encoding: 'base64' });

      console.log('Imagem salva em:', filePath);
  } catch (error) {
      console.error('Erro ao salvar imagem:', error);
  }
}

async function createDish(dishData) {
    try {
      const dish = new Dish(dishData);
      await dish.save();
      return { success: true, message: 'Prato criado com sucesso!', dish };
    } catch (error) {
      console.error('Erro ao criar prato:', error);
      return { success: false, message: 'Erro ao criar o prato.', error };
    }
  }

module.exports = { handleAddDishStep };
