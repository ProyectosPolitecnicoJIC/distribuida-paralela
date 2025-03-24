export class Propietario{
    constructor(identificacion, nombre, direccion, id = null){
        this.id = id;
        this.identificacion = identificacion;
        this.nombre = nombre;
        this.direccion = direccion;
    }
}