const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../back/public'),
  devServer: {
    proxy: 'http://localhost:3000', // Redireciona chamadas de API para o Node.js
  },
};