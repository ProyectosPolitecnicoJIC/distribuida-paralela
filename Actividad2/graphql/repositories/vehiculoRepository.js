import Vehiculo from '../models/Vehiculo.js';

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
        return new Vehiculo(rows[0].placa, rows[0].marca, rows[0].fecha_matricula, 0, rows[0].propietario_id, rows[0].id);
    }

    async getByPlaca(placa){
        const rows = await this.dao.query('SELECT * FROM vehiculo WHERE placa = ?', [placa]);
        if(rows.length === 0){
            return null;
        }
        return new Vehiculo(rows[0].placa, rows[0].marca, rows[0].fecha_matricula,0, rows[0].propietario_id, rows[0].id);
    }

    async create(vehiculo){
        return await this.dao.query('INSERT INTO vehiculo (placa, marca, fecha_matricula, propietario_id) VALUES (?, ?, ?, ?)', 
            [vehiculo.placa, vehiculo.marca, vehiculo.fechaMatricula, vehiculo.idPropietario]);
    }

    async update(vehiculo){
        return await this.dao.query('UPDATE vehiculo SET placa = ?, marca = ?, fecha_matricula = ?, propietario_id = ? WHERE id = ?', 
            [vehiculo.placa, vehiculo.marca, vehiculo.fechaMatricula, vehiculo.idPropietario, vehiculo.id]);
    }

    async delete(id){
        return await this.dao.query('DELETE FROM vehiculo WHERE id = ?', [id]);
    }

}