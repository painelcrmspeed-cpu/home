// app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configurar o EJS como motor de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // Adicionei 'public' como diretório estático

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index', { title: 'CRMSPEED - Sua Solução CRM' }); // Renderiza index.ejs
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
