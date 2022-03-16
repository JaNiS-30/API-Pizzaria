const res = require('express/lib/response');
const fs = require('fs');

module.exports = {
    async buscaPizzas() {
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        return JSON.parse(resultado)
    },
    async buscaPizzaPorPagina(pg){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        let inicio = 5 * pg
        let resposta = []

        if (resultado.pizzas[inicio] == null) return `A página ${pg} não tem nenhuma pizza cadastrada`

        for (let i = inicio; i < inicio + 5; i++){
            resposta.push(resultado.pizzas[i]) 
        }

        return resposta
    },
    async adicionaPizza(pizza) {
        let resultado = await this.buscaPizzas()
        resultado.pizzas.push(pizza)
        await fs.writeFileSync("./bancoDeDados.json", JSON.stringify(resultado))
    },
    async verificaPizza(id){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        if (resultado.pizzas[id] == undefined) return false

        return true
    },
    async buscaUmaPizza(id){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        return resultado.pizzas[id]
    },
    async removePizza(id){
        let resultado = await this.buscaPizzas()
        resultado.pizzas.splice(id,1)
        await fs.writeFileSync("./bancoDeDados.json", JSON.stringify(resultado))
    },
    async alteraPizza(id, nomePizza, valorPizza){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        resultado.pizzas[id].nomePizza = nomePizza
        resultado.pizzas[id].valorPizza = valorPizza

        await fs.writeFileSync("./bancoDeDados.json", JSON.stringify(resultado))
    }
};