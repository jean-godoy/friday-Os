//cria escopo
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

//importa conexao com DB
const DB = require('../models/sql');

//Rota

//adiciona novo cliente
router.post('/cliente-adicionar', (req, res) => {

    const sql = "INSERT INTO clientes (nome,telefone,email,cpf,data_nasc,sexo) VALUES (?, ?, ?, ?, ?, ?)";
    DB.query(
        sql,
        [req.body.nome, req.body.telefone, req.body.email, req.body.cpf, req.body.data_nasc, req.body.sexo],
        (err, rows, fields) => {
            if (!err) {
                return res.json({ success: `Cliente ${req.body.nome} cadastrado com Sucesso` })
            } else {
                return res.json({ success: "Erro ao cadastrar cliente - " + err });
            }
        });
});


//retorna id, nome sobre nome
router.get('/clientes', (req, res) => {

    const sql = "SELECT id_cliente, nome FROM clientes";
    DB.query(sql, (err, rows, fields) => {
        // DB.release();
        if (!err) {
            return res.json(rows);
        } else {
            return res.json({ success: "Nenhum dado encontrado" })
        }
    });

});

//retorna cliente pelo id
router.get('/cliente-id/:id', (req, res) => {

    let id = req.params.id;
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?";
    DB.query(sql, [id], (err, rows, fields) => {

        if (!err) {
            return res.json(rows[0]);
        } else {
            return res.json({ success: "Nenhum dado encontrado..." })
        }
        DB.release();
    })
})

//equipamentos

router.get('/equipamentos/:id', (req, res) => {
    let id = req.params.id;
    const sql = "SELECT * FROM dispositivos WHERE id_cliente = ?";
    DB.query(sql, [id], (err, rows, fields) => {
        if (!err) {
            if (rows.length > 0) {
                return res.json(rows);
            }
            return res.json({ success: " Nenhum Equipamento Cadastrado" });
        } else {
            return res.json({ success: "Nenhum dado encontrado..." });
        }
        DB.release();
    })
});

//Adiciona novo equipamentos
router.post('/adicionar-dispositivo', (req, res) => {
    const id_c = req.body.id_cliente;
    const sql = " INSERT INTO dispositivos (id_cliente, dispositivo, marca, modelo, numero_serie) VALUES (?,?,?,?,?)";
    DB.query(
        sql,
        [req.body.id_cliente, req.body.dispositivo, req.body.marca, req.body.modelo, req.body.numero_serie],
        (err, rows, fields) => {
            if (!err) {
                return res.json({ success: `Aparelho ${req.body.dispositivo}, cadastrado com sucesso!` })
            } else {
                return res.json({ success: "Erro ao cadastrar dispositivo - " + err });
            }
        }
    );
})

//pega equipamento pelo id
router.get('/equipamento-detalhe/:id', (req, res) => {
    const id_device = req.params.id;
    const sql = "SELECT clientes.nome, dispositivos.* FROM clientes, dispositivos WHERE clientes.id_cliente = dispositivos.id_cliente AND dispositivos.id = ?";
    DB.query(sql, [id_device], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0])
        } else {
            return res.json({ success: "Nenhum Dispositivo Encontrado - " + err });
        }
    })
})

//primeira parte da criação da ficha de entrada, retorna dados clientes, nome cpf e telefone , do dispositivo , equipamento e numero de serie e id
router.get('/ficha-entrada/:id', (req, res) => {
    const id_device = req.params.id;
    const sql =
        "SELECT clientes.nome, clientes.telefone, clientes.cpf, dispositivos.id, dispositivos.dispositivo, dispositivos.numero_serie FROM clientes, dispositivos WHERE clientes.id_cliente = dispositivos.id_cliente AND dispositivos.id = ? ";

    DB.query(sql, [id_device], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0]);
        }
    });

});

//route for device list order
router.get('/fichas/:id', (req,res) => {
    const id_device = req.params.id;
    const sql = "SELECT * FROM ficha_entrada WHERE id_dispositivo = ?";
    DB.query(sql,[id_device], (err,rows,fields) =>{
        if(!err){
            return res.json(rows)
        }else{
            return res.json({success: "Nenhuma Ficha cadastrada"});
        }
    })
})

//cadastra ficha de entrada
router.post('/gerar-nova-ficha', (req, res) => {

    const sql = "INSERT INTO ficha_entrada (id_dispositivo, defeito_relatado, data_entrada, status) VALUES (?,?,?,?)";
    DB.query(
        sql,
        [req.body.id_dispositivo, req.body.defeito_relatado, req.body.data_entrada, req.body.status],
        (err, rows, fields) => {
            if (!err) {
                return res.json({ succeess: "Ficha Cadastrada com sucesso" });
            } else {
                return res.json({ succeess: "Erro ao cadastrar ficha" });
            }
        }
    )
});

//rota que retorna lista de ficha cadastrais
router.get('/fichas', (req, res) => {

    const sql = "SELECT clientes.nome, dispositivos.*, ficha_entrada.* FROM clientes, dispositivos, ficha_entrada WHERE dispositivos.id = ficha_entrada.id_dispositivo AND clientes.id_cliente = dispositivos.id_cliente";
    DB.query(sql, (err, rows, fields) => {
        if (!err) {
            return res.json(rows)
        } else {
            return res.json({ success: "Nenhum Registro Encontrado" });
        }
    });

});

//rota que retorna ficha pelo id
router.get('/ficha-id/:id', (req, res) => {
    const sql = "SELECT clientes.nome, dispositivos.*, ficha_entrada.* FROM clientes, dispositivos, ficha_entrada WHERE dispositivos.id = ficha_entrada.id_dispositivo AND clientes.id_cliente = dispositivos.id_cliente  AND ficha_entrada.id = ?";
    DB.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0]);
        }
    });
});

//route for update status of device
router.post('/status', (req, res) => {
               
    // const sql = "UPDATE ficha_entrada SET status = ? WHERE id_dispositivo = ?";
    const sql = `UPDATE ficha_entrada SET status = ${req.body.status} WHERE id_dispositivo = ${req.body.id_dispositivo}`;
    DB.query(
        sql, (err, rows, fields) => {
        if(!err){
            console.log(rows)
            return res.json("Status Ok");
        }else{
            console.log(err)
            return res.json({success:'Erro ao Atualizar o Status', err})
        }
    });
});

//rota responsavel por adicionar orcamento
router.post('/adicionar-orcamento', (req, res) => {

    const sql = " INSERT INTO orcamentos (id_ficha, id_dispositivo, id_cliente, nome_cliente, defeito, dispositivo, marca, modelo, relatorio, obs, valor_total, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
    DB.query(
        sql,
        [req.body.id_ficha, req.body.id_dispositivo, req.body.id_cliente, req.body.nome_cliente, req.body.defeito, req.body.dispositivo, req.body.marca, req.body.modelo, req.body.relatorio, req.body.obs, req.body.valor_total, req.body.create_at],
        (err, rows, fields) => {
            if (!err) {
                // console.log("id: " + rows.insertId)
                return res.json({ success: "Orçamento Cadastrado com Sucesso", id: rows.insertId })
            } else {
                return res.json({ succeess: "Erro ao cadastrar orcamento", erro: err });
            }
        }
    );
});

//rota que retorna orcamento pelo id
router.get('/orcamento-id/:id', (req, res) => {
    const sql = "SELECT * FROM orcamentos  WHERE id_orcamento = ?";
    DB.query(sql, [req.params.id], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0]);
        } else {
            return res.json({ succeess: "Nenhum orçamento corespondente pelo id", erro: err });
        }
    });
});

//rota que retorna todos orçamentos vinculados ao id da ficha
router.get('/orcamento-all/:id_ficha', (req, res) => {
    const sql = "SELECT * FROM orcamentos WHERE id_ficha = ? ORDER BY id_ficha DESC";
    DB.query(sql, [req.params.id_ficha], (err, rows, fields) => {
        if (!err) {
            return res.json(rows)
        } else {
            return res.json({ succeess: "Nenhum orçamento corespondente pelo id da ficha", erro: err })
        }
    });
});

//rota que armazena o laudo do orcamento
router.post('/laudo-add', (req, res) => {

    const sql = "INSERT INTO orcamento_laudo ( id_cliente, id_orcamento, id_dispositivo, equipamento, marca, modelo, nome_cliente, data_entrada, defeito_relatado, defeito_apresentado, laudo_tecnico, descricao_produtos, valor_total, create_at ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    DB.query(
        sql,
        [req.body.id_cliente, req.body.id_orcamento, req.body.id_dispositivo, req.body.equipamento, req.body.marca, req.body.modelo, req.body.nome_cliente, req.body.data_entrada, req.body.defeito_relatado, req.body.defeito_apresentado, req.body.laudo_tecnico, req.body.descricao_produtos, req.body.valor_total, req.body.create_at],
        (err, rows, fields) => {
            if (!err) {
                return res.json({ success: "Laudo Cadastrado com Sucesso", id_laudo: rows.insertId })
            } else {
                return res.json({ succeess: "Erro ao Cadastrar Laudo", erro: err });
            }
        }
    )
});

//rota que retorna os dados do laudo pelo id do laudp
router.get('/laudo/:id', (req, res) => {
    const id_laudo = req.params.id
    const sql = "SELECT clientes.telefone, clientes.cpf, dispositivos.numero_serie, orcamento_laudo.*  FROM clientes, dispositivos, orcamento_laudo WHERE clientes.id_cliente = orcamento_laudo.id_cliente AND dispositivos.id = orcamento_laudo.id_dispositivo AND orcamento_laudo.id_laudo = ?";
    DB.query(sql, [id_laudo], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0]);
        } else {
            return res.json({ succeess: "Nunhum laudo coresponde pelo id", erro: err });
        }
    });
});


//return all users
router.get('/users', (req, res) => {
    const sql = "SELECT users.id_user, users.user_name FROM users";
    DB.query(sql, (err, rows, fields) => {
        if (!err) {
            return res.json(rows);
        } else {
            return res.json({ succeess: "Nunhum Usuario Cadastrado", erro: err });
        }
    });
});

//return user by id
router.get('/user-id/:id', (req, res) => {
    const user_id = req.params.id;
    const sql = "SELECT users.id_user, users.user_name, users.user_email FROM users WHERE id_user = ?";
    DB.query(sql, [user_id], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0]);
        } else {
            return res.json({ succeess: "Nunhum Usuario Cadastrado", erro: err });
        }
    });
});

//add new user
router.post('/user-add', (req, res) => {
    const sql = "INSERT INTO users(user_name, user_email, user_pass, token, create_at) VALUES ( ?, ?, ?, '1b2b3c4d5e', '2020-09-27 12:44:50' )";
    DB.query(sql,
        [req.body.user_name, req.body.user_email, req.body.user_pass],
        (err, rows, fields) => {
            if (!err) {
                return res.json(rows[0])
            } else {
                return res.json({ succeess: "Erro ao Cadastrar Usuario..", erro: err });
            }
        }
    );


});

//route for user all data
router.get('/user-all/:id', (req, res) => {
    const user_id = req.params.id;
    const sql = "SELECT * FROM users WHERE id_user = ?";
    DB.query(sql, [user_id], (err, rows, fields) => {
        if (!err) {
            return res.json(rows[0]);
        } else {
            return res.json({ succeess: "Nunhum Usuario Cadastrado", erro: err });
        }
    });
});

//router for update user by id
router.post('/user-edit/:id', (req, res) => {
    const user_id = req.params.id;
    // console.log(req.body)
    const sql = "UPDATE users SET user_name = ?, user_email = ?, user_pass = ? WHERE id_user = ?";
    DB.query(sql,
        [req.body.user_name, req.body.user_email, req.body.user_pass, user_id],
        (err, rows, fields) => {
            if (!err) {
                return res.json({ success: "Usuario: " + req.body.user_name + ", editado com Sucesso!" });
            } else {
                return res.json({ success: "Erro ao Editar Usuario..", error: err });
            }
        }
    );

});

//roter dor drop user by ai
router.get('/user-delete/:id', (req, res) => {
    const user_id = req.params.id;
    const sql = "DELETE FROM users WHERE id_user = ?";
    DB.query(sql,[user_id], (err, rows, fields) => {
        if(!err){
            return res.json({success: "Usuario Deletado Com Sucesso!"});
        }else {
            return res.json({success: "Erro ao Deletar Usuáruo.."});
        }
    })
});

//router get result clientes_dados
router.get('/user-data/:id', (req, res) => {
    const user_id = req.params.id;
    const sql = "SELECT * FROM cliente_dados WHERE id_cliente = ?";
    DB.query(sql,[user_id], (err,rows,fields) => {
        if(!err) {
            return res.json(rows[0]);
        }else {
            return res.json({success: "Usuario não possiu dados"});
        }
    });
});

//route for add data user
router.post('/user-data-add', (req, res) => {
    const sql = "INSERT INTO cliente_dados(id_cliente, endereco, numero, bairro, cidade, cep, estado, create_at) VALUES (?,?,?,?,?,?,?,?)";
    DB.query(
        sql,
        [req.body.id_cliente, req.body.endereco, req.body.numero, req.body.bairro, req.body.cidade, req.body.cep, req.body.estado, req.body.create_at],
        (err, rows, fields) => {
            if(!err){
                return res.json(rows[0]);
            }else {
                return res.json({success: "Ops.., Erro ao Cadastrar Dados do Usuario!"})
            }
        }
    );
});

//router for edit client data by id
router.post('/user-data-edit/:id', (req,res) => {
    const client_id = req.params.id;
    const sql = "UPDATE cliente_dados SET endereco = ?, numero = ?, bairro = ?, cidade = ?, cep = ?, estado = ? WHERE id_cliente = ?";
    DB.query(
        sql,
        [req.body.endereco, req.body.numero, req.body.bairro, req.body.cidade, req.body.cep, req.body.estado, client_id],
        (err, rows, fields) => {
            if(!err){
                return res.json(true);
            }else{
                return res.json(false);
            }
        }
    );
});

router.get('/user-data-delete/:id', (req, res) => {
    const user_id = req.params.id;
    const sql = "DELETE FROM cliente_dados WHERE id_cliente = ?";
    DB.query(sql,[user_id], (err, rows, fields) => {
        if(!err){
            return res.json({success: "Dados Deletado Com Sucesso!"});
        }else {
            return res.json({success: "Erro ao Deletar Dados.."});
        }
    })
});

module.exports = router;