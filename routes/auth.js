//cria escopo
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

//importa conexao com DB
const DB = require('../models/sql');

//routes

//router for check user data
router.post('/checked', (req, res) => {

    const sql = "SELECT * FROM users WHERE user_name = ? AND user_pass = ?";
    DB.query(sql, [req.body.user_name, req.body.user_pass], (err, rows, fields) => {
        if(!err){
            return res.json(rows[0]);
            console.log(rows[0])
        }else{
            return res.json({success: "Nenhum usuario encontrado" + err});
        }
    });


});

module.exports = router;

