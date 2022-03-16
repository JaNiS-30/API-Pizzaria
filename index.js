const express = require('express')
const bancoDeDados = require('./bancoDeDados.js')
const Funcoes = require('./functions')
const axios = require('axios')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.listen(process.env.PORT || 3000, () => console.log('Servidor rodando'))

app.get('/pizzas', async (req, res) => {

    let resultado = await bancoDeDados.buscaPizzas()
    res.status(200).send(resultado.pizzas)

})

app.get('/pizzas/:pg', async (req, res) => {

    const pg = parseInt(req.params.pg)

    let resultado = await bancoDeDados.buscaPizzaPorPagina(pg)
    res.status(200).send(resultado)
})

app.post('/pizzas', (req, res) => {

    if (!Funcoes.verificaFormato(req.body.nomePizza, 'string')) {
        res.status(400).send(`O nome da pizza está no formato incorreto, por favor, digite letras`)
    } else if (!Funcoes.verificaFormato(req.body.valorPizza, 'number')) {
        res.status(400).send(`O valor da pizza não é um número, por favor, digite números`)
    } else {

        const dados = {
            "nomePizza": req.body.nomePizza,
            "valorPizza": req.body.valorPizza
        }

        bancoDeDados.adicionaPizza(dados)

        res.status(201).send(`${req.body.nomePizza} incluído com sucesso`)
    }
})

app.get('/pizzas/:id', async (req, res) => {
    const id = parseInt(req.params.id - 1)
    
    let verificacao = await bancoDeDados.verificaPizza(id)
    let resultado = await bancoDeDados.buscaUmaPizza(id)

    if (verificacao == false) {
        res.status(400).send(`O id ${id + 1} não corresponde a nenhuma pizza cadastrada`)
    } else {
        res.status(200).send(resultado)
    }
})

app.delete('/pizzas/:id', async (req, res) => {
    const id = parseInt(req.params.id - 1)

    let verificacao = await bancoDeDados.verificaPizza(id)

    if (verificacao == false) {
        res.status(400).send(`O id ${id + 1} não corresponde a nenhuma pizza cadastrada`)
    } else {
        await bancoDeDados.removePizza(id)
        res.status(200).send(`A pizza ${id + 1} foi deletada com sucesso`)
    }
})

app.patch('/pizzas/:id', async (req, res) => {
    const id = parseInt(req.params.id - 1)

    let verificacao = await bancoDeDados.verificaPizza(id)

    if (verificacao == false) {
        res.status(400).send(`O id ${id+ 1} não corresponde a nenhuma pizza cadastrada`)
    } else {
        if (Funcoes.verificaFormato(req.body.nomePizza, 'string') && Funcoes.verificaFormato(req.body.valorPizza, 'number')) {
            resultado = await bancoDeDados.buscaUmaPizza(id)
            
            resultado.nomePizza = req.body.nomePizza
            resultado.valorPizza = req.body.valorPizza

            await bancoDeDados.alteraPizza(id, resultado.nomePizza, resultado.valorPizza)

            res.status(200).send(`A pizza ${resultado.nomePizza} foi alterada com sucesso`)

        } else res.status(400).send(`Há um erro nos valores de entrada, digite letras para a pizza e números para o preço`)
    }
})

async function buscaEndereco(lat, long, key) {
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`
    const resposta = await axios.get(url)
    return resposta.data;
}

app.get('/endereco/:lat/:long/:key', (req, res) => {
    let lat = req.params.lat
    let long = req.params.long
    let key = req.params.key

    buscaEndereco(lat, long, key).then((valor) => {
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