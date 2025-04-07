export default class ReporteRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getInfraccionesByPropietarioIdentificacion(identificacion){
        return await this.dao.query('SELECT infraccion.*, propietario.*, vehiculo.* FROM infraccion JOIN vehiculo ON infraccion.vehiculo_id = vehiculo.id JOIN propietario ON vehiculo.propietario_id = propietario.id WHERE propietario.identificacion = ?', [identificacion]);
    }
}