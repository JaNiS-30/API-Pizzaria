const express = require('express')
const bancoDeDados = require('./bancoDeDados')
const Funcoes = require('./functions')
const axios = require('axios')
const { response } = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.listen(process.env.PORT || 3000, () => console.log('Servidor rodando'))

app.get('/pizzas', (req, res) => {

    res.status(200).send(bancoDeDados)

})

app.post('/pizzas', (req, res) => {

    if (!Funcoes.verificaFormato(req.body.nomePizza, 'string')) {
        res.status(400).send(`O nome da pizza está no formato incorreto, por favor, digite letras`)
    } else if (!Funcoes.verificaFormato(req.body.valorPizza, 'number')) {
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

app.get('/pizzas/:id', (req, res) => {
    const id = parseInt(req.params.id)
    if (bancoDeDados[id] == undefined) {
        res.status(400).send(`O id ${id} não corresponde a nenhuma pizza cadastrada`)
    } else {
        res.status(200).send(bancoDeDados[id])
    }
})

app.delete('/pizzas/:id', (req, res) => {
    const id = parseInt(req.params.id)
    if (bancoDeDados[id] == undefined) {
        res.status(400).send(`O id ${id} não corresponde a nenhuma pizza cadastrada`)
    } else {
        bancoDeDados.splice(id, 1)
        res.status(200).send(`A pizza ${id} foi deletada com sucesso`)
    }
})

app.patch('/pizzas/:id', (req, res) => {
    const id = parseInt(req.params.id)

    if (bancoDeDados[id] == undefined) {
        res.status(400).send(`O id ${id} não corresponde a nenhuma pizza cadastrada`)
    } else {
        if (Funcoes.verificaFormato(req.body.nomePizza, 'string') && Funcoes.verificaFormato(req.body.valorPizza, 'number')) {
            bancoDeDados[id].nomePizza = req.body.nomePizza
            bancoDeDados[id].valorPizza = req.body.valorPizza
        } else res.status(400).send(`Há um erro nos valores de entrada, digite letras para a pizza e números para o preço`)

        res.status(200).send(`A pizza ${bancoDeDados[id].nomePizza} foi alterada com sucesso`)
    }
})

async function buscaEndereco(lat, long, key) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`
    const resposta = await axios.get(url)
    return resposta.data;
}

app.get('/endereco/:lat/:long', (req, res) => {
    let lat = req.params.lat
    let long = req.params.long

    buscaEndereco(lat, long).then((valor) => {
        var address = {
            houseNumber: '',
            streetName: '',
            districtName: 'Centro',
            cityName: '',
            countryName: ''
        }

        if (valor.results[0].address_components[0].types[0] === 'street_number') address.houseNumber = valor.results[0].address_components[0].long_name
        if (valor.results[0].address_components[1].types[0] === 'route') address.streetName = valor.results[0].address_components[1].long_name
        if (valor.results[0].address_components[2].types[2] === 'sublocality_level_1') address.districtName = valor.results[0].address_components[2].long_name
        if (valor.results[0].address_components[3].types[0] === 'administrative_area_level_2') address.cityName = valor.results[0].address_components[3].long_name
        if (valor.results[0].address_components[4].types[0] === 'administrative_area_level_1') address.countryName = valor.results[0].address_components[4].long_name
        res.send(address)
    })

})