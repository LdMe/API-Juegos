class MissingIDError extends Error {
    constructor(){
        super("El elemento no tiene id")
    }
}
class ElementNotFoundError extends Error {
    constructor(){
        super("El elemento no existe")
    }
}

export {
    MissingIDError,
    ElementNotFoundError
}