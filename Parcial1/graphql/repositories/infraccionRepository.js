import Infraccion from '../models/Infraccion.js';

export default class InfraccionRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        return await this.dao.query('SELECT * FROM infraccion');
    }

    async getById(id) {
        const rows = await this.dao.query('SELECT * FROM infraccion WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        return new Infraccion(rows[0].fecha, rows[0].fuente);
    }

    async create(infraccion) {
        const result = await this.dao.query(
            'INSERT INTO infraccion (fecha, fuente, vehiculo_id) VALUES (?, ?, ?)',
            [infraccion.fecha, infraccion.fuente, infraccion.vehiculoId]
        );

        const insertedId = result.insertId || result.lastID;

        return {
            id: insertedId,
            fecha: infraccion.fecha,
            fuente: infraccion.fuente,
            placa: infraccion.placa,
            vehiculoId: infraccion.vehiculoId
        };
    }


    async update(infraccion) {
        if (typeof infraccion != Infraccion) {
            throw new Error('Invalid argument. Expected Infraccion.');
        }
        return await this.dao.query('UPDATE infraccion SET fecha = ?, fuente = ? WHERE id = ?', [infraccion.fecha, infraccion.fuente, infraccion.id]);
    }

    async delete(id) {
        return await this.dao.query('DELETE FROM infraccion WHERE id = ?', [id]);
    }

}