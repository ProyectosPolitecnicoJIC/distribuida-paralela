CREATE TABLE propietario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    tipo ENUM('PERSONA', 'EMPRESA') NOT NULL
);


CREATE TABLE vehiculo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    placa VARCHAR(10) NOT NULL,
    marca VARCHAR(50) NOT NULL,
    fecha_matricula DATE NOT NULL,
    propietario_id INT NOT NULL,
    FOREIGN KEY (propietario_id) REFERENCES propietario(id)
);


CREATE TABLE infraccion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    vehiculo_id INT NOT NULL,
    fuente ENUM('AGENTE', 'CAMARA') NOT NULL,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculo(id)
);
