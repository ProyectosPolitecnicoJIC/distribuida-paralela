export default class Vehiculo{
    constructor(placa, marca, fechaMatricula, identificacionPropietario, idPropietario=null,id=null){
        this.id = id;
        this.placa = placa;
        this.marca = marca;
        this.fechaMatricula = fechaMatricula;
        this.identificacionPropietario = identificacionPropietario;
        this.idPropietario = idPropietario;
    }
}