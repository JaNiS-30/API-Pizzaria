const express = require('express')
const bancoDeDados = require('./bancoDeDados')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.listen(3000, () => console.log('Servidor rodando'))

app.get('/', (req, res) => {

    res.status(200).send(bancoDeDados)

})

app.post('/', (req, res) => {

    if (typeof req.body.nomePizza !== 'string') {
        res.status(400).send(`O nome da pizza está no formato incorreto, por favor, digite letras`)
    } else if (typeof req.body.valorPizza !== 'number') {
        res.status(400).send(`O valor da pizza não é um número, por favor, digite números`)
    } else {

        const dados = {
            "Nome Pizza": req.body.nomePizza,
            "Valor": req.body.valorPizza
        }

        bancoDeDados.push(dados)

        res.status(201).send(`${req.body.nomePizza} incluído com sucesso`)
    }
})

app.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    if (bancoDeDados[id] == undefined) {
        res.status(400).send(`O id ${id} não corresponde a nenhuma pizza cadastrada`)
    } else {
        res.status(200).send(bancoDeDados[id])
    }
})