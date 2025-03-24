export default class Infraccion{
    constructor( fecha, fuente, id = null){
        this.id = id;
        this.fecha = fecha;
        this.fuente = fuente;
    }
}