import mysql from 'mysql2';
import dbConfig from '../configurations/database/dbConfig.js';

export default class DbService {
    constructor() {
        this.connection = mysql.createConnection({
            host: dbConfig.INFRACTION_DB_HOST,
            user: dbConfig.INFRACTION_DB_USER,
            password: dbConfig.INFRACTION_DB_PASSWORD,
            database: dbConfig.INFRACTION_DB_DATABASE,
            port: dbConfig.INFRACTION_DB_PORT
        });
    }

    connect() {
        this.connection.connect((err) => {
            if (err) {
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });
    }

    disconnect() {
        this.connection.end((err) => {
            if (err) {
                console.log('Error disconnecting from Db');
                return;
            }
            console.log('Connection terminated');
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
}


