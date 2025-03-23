import Propietario from '../models/propietario.js';

export default class PropietarioRepositoru {
    constructor(dao){
        this.dao = dao;
    }

    async getAll(){
        return await this.dao.query('SELECT * FROM propietario');
    }

    async getById(id){
        const rows = await this.dao.query('SELECT * FROM propietario WHERE id = ?', [id]);
        if(rows.length === 0){
            return null;
        }
        return new Propietario(rows[0].nombre, rows[0].apellido);
    }

    async create(propietario){
        if(typeof propietario != Propietario){
            throw new Error('Invalid argument. Expected Propietario.');
        }
        return await this.dao.query('INSERT INTO propietario (nombre, apellido) VALUES (?, ?)', 
            [propietario.nombre, propietario.apellido]);
    }

    async update(propietario){
        if(typeof propietario != Propietario){
            throw new Error('Invalid argument. Expected Propietario.');
        }
        return await this.dao.query('UPDATE propietario SET nombre = ?, apellido = ? WHERE id = ?', [nombre, apellido, id]);
    }

    async delete(id){
        return await this.dao.query('DELETE FROM propietario WHERE id = ?', [id]);
    }

    
}