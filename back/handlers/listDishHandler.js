const { resetUserState } = require('../state/stateManager');
const Dish = require('../models/Dish');

async function handleListDishes(message, client) {
  try {
    const dishes = await listDishes();

    if (dishes.length === 0) {
      client.sendMessage(
        message.from,
        "No momento, não há pratos disponíveis no cardápio. Volte em breve! 🍽️"
      );
    } else {
      let stringDishes = `🌟 *Confira seu cardápio especial:* 🌟\n`;
      dishes.forEach((dish, index) => {
        stringDishes += `\n${index + 1}. *${dish.name}*\n   _${dish.description || 'Sem descrição'}_\n   💰 *Preço:* R$ ${dish.price.toFixed(2)}\n`;
      });
      stringDishes += `\n😋 Escolha seu prato favorito e nos avise para prosseguir com o pedido!`;
      client.sendMessage(message.from, stringDishes);
    }
  } catch (error) {
    console.error('Erro ao listar pratos:', error);
    client.sendMessage(
      message.from,
      'Houve um erro ao buscar o cardápio. Tente novamente mais tarde. 🙁'
    );
  } finally {
    resetUserState(message.from);
  }
}

async function listDishes() {
  try {
    const dishes = await Dish.find();
    return dishes;
  } catch (error) {
    console.error('Erro ao acessar a coleção de pratos:', error);
    throw error;
  }
}

module.exports = { handleListDishes };
