//Variaveis de ambiente
require('dotenv').config();
//carregamento dos modulos primarios
const express = require('express');
// const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

const cors = require('cors');
const path = require('path');
const ejs = require('ejs');

const db = require('./models/sql');

//importa as rotas da api
const api = require('./routes/api');
const pdf = require('./routes/pdf');
const auth = require('./routes/auth');

//Configurações

//diretorios estaticos
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.set('views', './views');

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


//rota api
app.use('/api', api);

//rota pds
app.use('/pdf', pdf);

//route auth
app.use('/auth', auth);



app.get('/', (req, res) => {
    res.send('<h1>Home</h1>')
});


app.get('/check-login/:email', (req, res) => {
    const email = req.params.email;
    User.findOne({ where: { email: email } }).then((data) => {
        if (data) {
            return res.json(data);
        } else {
            return res.json({ data: "Usuario nâo encontrado!" })
        }
    })
});


//definições de servidor
const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => {
    console.log("Ola Sr. Godoy, Servidor rodando na porta: " + PORT);
});