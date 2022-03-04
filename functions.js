class Funcoes {
    verificaFormato = (palavra, formato) => {
        if (typeof palavra === formato) return true
        return false
    }
}

module.exports = new Funcoes