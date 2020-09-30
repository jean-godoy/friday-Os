const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const PDF = require('html-pdf');

//importa conexao com DB
const DB = require('../models/sql');

function dateOutPut(date) {

    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

}


router.get('/laudo-pdf/:id', (req, res) => {


    const id = req.params.id;
    const sql = "SELECT clientes.telefone, clientes.cpf, dispositivos.numero_serie, orcamento_laudo.*  FROM clientes, dispositivos, orcamento_laudo WHERE clientes.id_cliente = orcamento_laudo.id_cliente AND dispositivos.id = orcamento_laudo.id_dispositivo AND orcamento_laudo.id_laudo = ?";

    DB.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err) {
            const dados = rows[0];
            const laudo_j = JSON.parse(dados.laudo_tecnico);
            const descricao_j = JSON.parse(dados.descricao_produtos)
            const dateOut = {
                data_entrada: dateOutPut(new Date(dados.data_entrada)),
                data_saida: dateOutPut(new Date(dados.create_at))
            }

            //    return res.json(rows[0])
            // console.log(dados)

            ejs.renderFile('./views/laudo-pdf.ejs',
                { data: dados, laudo: laudo_j, descricao: descricao_j, dateOut: dateOut }, (err, html) => {
                    if (err) {
                        return res.status(500).json({ message: "Error in Server" });
                    }

                    const options = {
                        format: 'A4',
                        border: {
                            top: '10'
                        }
                    };

                    PDF.create(html, options).toFile("./pdf/laudo.pdf", (error, response) => {
                        if (!error) {
                            return res.json({ message: "PDF GENERATED   " });
                        } else {
                            return res.json({ message: "FAIL IN PDF GENERATED   " });
                        }
                    });
                });

        } else {
            return res.json({ success: "Nenhum laudo coresopnde a esse id" });
        }
    });


});

router.get('/download/pdf-laudo', (req, res) => {
    res.type('pdf');
    res.download('./pdf/laudo.pdf');
});

router.get('/orcamento-pdf/:id', (req, res) => {
    const id_o = req.params.id;
    const sql = "Select * from orcamentos WHERE id_orcamento = ?";
    DB.query(sql, [id_o], (err, rows, fields) => {
        if (!err) {
            const data = rows[0];
            const relatorio_j = JSON.parse(data.relatorio);
            const obs_j = JSON.parse(data.obs);
            // console.log(relatorio_j)

            ejs.renderFile('./views/orcamento-pdf.ejs',
                { data: data, relatorio: relatorio_j, obs: obs_j }, (err, html) => {
                    if (err) {
                        return res.status(500).json({ message: "Error in Server" });
                    }

                    const options = {
                        format: 'A4',
                        border: {
                            top: '10'
                        }
                    };

                    PDF.create(html, options).toFile("./pdf/orcamento.pdf", (error, response) => {
                        if (!error) {
                            return res.json({ message: "PDF GENERATED   " });
                        } else {
                            return res.json({ message: "FAIL IN PDF GENERATED   " });
                        }
                    });

                });
        } else {
            return res.json({ success: "Nenhum Orcamento coresopnde a esse id" });
        }
    })
});

router.get('/download/pdf-orcamento', (req, res) => {
    res.type('pdf');
    res.download('./pdf/orcamento.pdf');
});


router.get('/ficha-entrada/:id', (req, res) => {
    const id_f = req.params.id;
    const sql = "SELECT clientes.nome, clientes.telefone, dispositivos.*, ficha_entrada.* FROM clientes, dispositivos, ficha_entrada WHERE dispositivos.id = ficha_entrada.id_dispositivo AND clientes.id_cliente = dispositivos.id_cliente  AND ficha_entrada.id = ?";
    DB.query(sql, [id_f], (err, rows, fields) => {
        if (!err) {
            const data = rows[0];
            const dateIn = dateOutPut(new Date(data.data_entrada))
            // console.log(dateIn)
            //começa a montar o pdf
            ejs.renderFile('./views/ficha-pdf.ejs',
                { data: data, date: dateIn }, (err, html) => {
                    if (err) {
                        return res.status(500).json({ message: "Error in Server" });
                    }

                    //definições de parametros do pdf
                    const options = {
                        format: 'A4',
                        border: {
                            top: '10'
                        }
                    };

                    PDF.create(html, options).toFile("./pdf/ficha.pdf", (error, response) => {
                        if (!error) {
                            return res.json({ message: "PDF GENERATED   " });
                        } else {
                            return res.json({ message: "FAIL IN PDF GENERATED   " });
                        }
                    })
                });
        } else {
            return res.json({ success: "Nenhum Orcamento coresopnde a esse id" });
        }
    });
});

router.get('/download/pdf-ficha', (req, res) => {
    res.type('pdf');
    res.download('./pdf/ficha.pdf');
});

module.exports = router;