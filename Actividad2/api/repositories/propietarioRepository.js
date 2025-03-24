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
        return new Propietario(rows[0].identificacion, rows[0].nombre, rows[0].direccion);
    }

    async create(propietario){
        if(typeof propietario != Propietario){
            throw new Error('Invalid argument. Expected Propietario.');
        }
        return await this.dao.query('INSERT INTO propietario (identificacion, nombre, direccion) VALUES (?, ?, ?)', 
            [propietario.identificacion, propietario.nombre, propietario.direccion]);
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