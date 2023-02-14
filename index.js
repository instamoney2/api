const express = require('express')
const app = express()
const port = 3000
const con = require('./conection')
const cors = require('cors')

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use(express.json())

app.get('/', (req, res) => {
    res.json("Hello world")
})

app.get('/user', async (req, res) => {
    
    await con.query('SELECT * FROM user', (err, result) => {
        if(err) throw err;

        if(result){
            res.json(result);
        }else{
            res.json("error")
        }

    })
})

app.post('/user', async (req, res) => {
    
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    if(nome && email && senha){
        await con.query(`SELECT * FROM user WHERE email = '${email}'`, (err, result) => {
            if(err) throw err;

            if(result.length > 0){
                res.json({"RES": "Email já existe!"})
            }else{
                con.query(`INSERT INTO user (nome, email, senha) VALUES ('${nome}', '${email}' , '${senha}')`, (err, result) => {
                    if(err) throw err;
            
                    if(result.insertId){
                        res.json({"RES": "Usuario cadastrado!"})
                    }else{
                        res.json({"RES": "Usuario já existe!"})
                    }
                }) 
            }

        }) 
    }else{
        res.json({"RES": "E preciso preencher todos os dados!"})
    }
})

app.post('/user/login', async (req, res) => {

    const email = req.body.email
    const senha = req.body.senha

    if(email && senha){
        await con.query(`SELECT * FROM user WHERE email = '${email}' AND senha = '${senha}'`, (err, result) => {
            if(err) throw err;

            if(result.length > 0 && result.length < 2){
                
                const id = result[0].id
                const nome = result[0].nome
                const em = result[0].email
                const saldo = result[0].saldo

                let data = {
                    id : id,
                    nome : nome,
                    email : em,
                    saldo : saldo
                }

                res.json(data)

            }else{
                res.json({'RES': 'Usuario não econtrado!'})
            }

        })
    }else{
        res.json({"RES": "Email e senha são necessários para logar!"})
    }

})

// posts

app.get('/post', async (req, res) => {
    
    await con.query('SELECT * FROM post', (err, result) => {
        if(err) throw err;

        if(result.length > 0){
            res.json(result)
        }else{
            res.json({"RES": "Não foram encontrados posts no momento!"})
        }

    })

})

app.get('/like/:id', async (req, res) => {

    const id = req.params.id;

    await con.query(`SELECT * FROM likepost WHERE iduser = ${id}`, (erro, resul) => {
        if(erro) throw erro;

        if(resul.length > 0){
            res.json(resul)
        }else{
            res.json("no data")
        }

    })
})

app.get('/post/:id', async (req, res) => {

    const id = req.params.id;

    if(id){

        await con.query(`SELECT * FROM post`, (err, result) => {
            if(err) throw err;

            con.query(`SELECT * FROM likepost WHERE iduser = ${id}`, (erro, resul) => {
                if(erro) throw erro;

                if(resul.length > 0){
                    let data = [];
    
                    data.push(result)

                    for(let i = 0; data[0].length > i; i++){
                        for(let a = 0; resul.length > a; a++){
                            if(data[0][i].id == resul[a].idpost){
                                
                                

                            }
                        }
                    }

                    res.json(data);

                }else{
                    res.json(result)
                }

            })

        })

    }else{
        res.json({"RES": "Id é necessário!"})
    }

})

app.post('/post', async (req, res) => {

    const nome = req.body.nome
    const link = req.body.link

    if(nome && link) {
        await con.query(`SELECT * FROM post WHERE link = '${link}'`, (err, result) => {
            if(err) throw err;

            if(result.length > 0){
                res.json({"RES": "Foto já cadastrada!"})
            }else{
                con.query(`INSERT INTO post (nome, link) VALUES ('${nome}', '${link}')`, (err, result) => {
                    if(err) throw err;

                    if(result.insertId){
                        res.json({RES: "Foto inserida com sucesso!"})
                    }

                })
            }

        })

    }else{
        res.json({"RES": "Inserir todos os dados por favor!"})
    }

})

// parte do like

app.post("/post/like", async (req, res) => {
    const user = req.body.userid
    const post = req.body.postid

    await con.query(`SELECT * FROM likepost WHERE iduser = '${user}' AND idpost = '${post}'`, (err, result) => {
        if(err) throw err;

        if(result.length > 0){
            res.json({"RES": "Liked"})
        }else{
            con.query(`INSERT INTO likepost (iduser, idpost) VALUES (${user}, ${post})`, (erro, resul) => {
                if(erro) throw erro;

                if(resul){
                    res.json({"RES": "Like"})
                }else{
                    res.json(resul)
                }

            })
        }

    })

})

app.put('/like/:id', async (req, res) => {

    const id = req.params.id;
    const valor = req.body.valor;

    if(id){

        await con.query(`UPDATE user SET saldo = ${valor} WHERE id = ${id}`, (err, result) => {
            if(err) throw err;

            if(result){
                res.json({"RES": "Adicionado"})
            }else{
                res.json({"RES": "Deu ruim"})
            }

        })

    }else{
        res.json({"RES": "Id é preciso!"})
    }

})


app.listen(port, () => {
    console.log(`Listen by ${port}`)
}) 