export default class Propietario{
    constructor(identificacion, nombre, direccion, tipo, id = null){
        this.id = id;
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.direccion = direccion;
        this.tipo = tipo;
    }
}