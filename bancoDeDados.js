const fs = require('fs');

module.exports = {
    async buscaPizzas() {
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        return JSON.parse(resultado)
    },
    async adicionaPizza(pizza) {
        let resultado = await this.buscaPizzas()
        resultado.push(pizza)
        await fs.writeFileSync("./bancoDeDados.json", JSON.stringify(resultado))
    },
    async verificaPizza(id){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        if (resultado[id] == undefined) return false

        return true
    },
    async buscaUmaPizza(id){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        return resultado[id]
    },
    async removePizza(id){
        let resultado = await this.buscaPizzas()
        resultado.splice(id,1)
        await fs.writeFileSync("./bancoDeDados.json", JSON.stringify(resultado))
    },
    async alteraPizza(id, nomePizza, valorPizza){
        let resultado = await fs.readFileSync("./bancoDeDados.json", { encoding: "utf-8" })
        resultado = JSON.parse(resultado)

        resultado[id].nomePizza = nomePizza
        resultado[id].valorPizza = valorPizza

        await fs.writeFileSync("./bancoDeDados.json", JSON.stringify(resultado))
    }
};