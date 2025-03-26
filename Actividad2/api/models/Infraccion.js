export default class Infraccion{
    constructor( fecha, fuente, placa, id = null, vehiculoId = null){
        this.id = id;
        this.fecha = fecha;
        this.fuente = fuente;
        this.placa = placa;
        this.vehiculoId = vehiculoId;
    }
}