import Vehiculo from '../models/vehiculoModel';

export default class VehiculoRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getAll(){
        return await this.dao.query('SELECT * FROM vehiculo');
    }

    async getById(id){
        const rows = await this.dao.query('SELECT * FROM vehiculo WHERE id = ?', [id]);
        if(rows.length === 0){
            return null;
        }
        return new Vehiculo(rows[0].placa, rows[0].marca, rows[0].fecha_matricula, rows[0].propietario_id);
    }

    async create(vehiculo){
        if(typeof vehiculo != Vehiculo){
            throw new Error('Invalid argument. Expected Vehiculo.');
        }
        return await this.dao.query('INSERT INTO vehiculo (placa, marca, fecha_matricula, propietario_id) VALUES (?, ?, ?, ?)', 
            [vehiculo.placa, vehiculo.marca, vehiculo.fechaMatricula, vehiculo.propietario]);
    }

    async update(vehiculo){
        if(typeof vehiculo != Vehiculo){
            throw new Error('Invalid argument. Expected Vehiculo.');
        }
        return await this.dao.query('UPDATE vehiculo SET placa = ?, marca = ?, fecha_matricula = ?, propietario_id = ? WHERE id = ?', [placa, marca, fechaMatricula, propietario]);
    }

    async delete(id){
        return await this.dao.query('DELETE FROM vehiculo WHERE id = ?', [id]);
    }

}