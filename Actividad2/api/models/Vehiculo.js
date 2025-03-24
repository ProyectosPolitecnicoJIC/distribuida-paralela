export class Vehiculo{
    constructor(placa, marca, fechaMatricula, propietario, id=null){
        this.id = id;
        this.placa = placa;
        this.marca = marca;
        this.fechaMatricula = fechaMatricula;
        this.propietario = propietario;
    }
}