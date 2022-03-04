module.exports = app => {
    const express = require('express')
    const app = express()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())


    app.get('/', (req, res) => {

        res.status(200).send(bancoDeDados)

    })

    app.post('/', (req, res) => {

        if (!funcoes.verificaFormato(req.body.nomePizza, 'string')) {
            res.status(400).send(`O nome da pizza está no formato incorreto, por favor, digite letras`)
        } else if (!funcoes.verificaFormato(req.body.valorPizza, 'number')) {
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

    app.delete('/:id', (req, res) => {
        const id = parseInt(req.params.id)
        if (bancoDeDados[id] == undefined) {
            res.status(400).send(`O id ${id} não corresponde a nenhuma pizza cadastrada`)
        } else {
            bancoDeDados.splice(id, 1)
            res.status(200).send(`A pizza ${id} foi deletada com sucesso`)
        }
    })

    app.patch('/:id', (req, res) => {
        const id = parseInt(req.params.id)

        if (bancoDeDados[id] == undefined) {
            res.status(400).send(`O id ${id} não corresponde a nenhuma pizza cadastrada`)
        } else {
            if (funcoes.verificaFormato(req.body.nomePizza, 'string') && funcoes.verificaFormato(req.body.valorPizza, 'number')) {
                bancoDeDados[id].nomePizza = req.body.nomePizza
                bancoDeDados[id].valorPizza = req.body.valorPizza
            } else res.status(400).send(`Há um erro nos valores de entrada, digite letras para a pizza e números para o preço`)

            res.status(200).send(`A pizza ${bancoDeDados[id].nomePizza} foi alterada com sucesso`)
        }
    })
}