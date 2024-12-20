// db.js
const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://nathanlucena89:40028922@menu-dev.vkdjv.mongodb.net/easymenu?retryWrites=true&w=majority&appName=menu-dev'; 

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Banco de dados conectado:', mongoose.connection.name);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

module.exports = connectDB;
