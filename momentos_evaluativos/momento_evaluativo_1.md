# Estandares

- Java RMI
- .Net Remoting
- Windows RPC

# Descripción
1.	Realizar el diagrama de clases e implementar el patrón interface con RMI que permita: 

- Capturar en el cliente el número de empleados y el número de meses. En la interface  implementar los métodos que permitan llenar la matriz de salarios con números aleatorios e informar al cliente el total pagado para cada empleado, el promedio de cada mes por pago de salarios y el total pagado en la matriz. 

  - Identificacion de actores:
    - Cliente
    - Servidor

  - Identificacion de clases:
    - Interface Empresa.
      - LlenarMatriz
      - TotalPagadoEmpleado
      - PromedioMes
      - TotalPagadoMatriz

    - Servidor(implementacion de clase): Clase que se encarga de realizar los calculos de los salarios.
      - LlenarMatriz: Metodo que se encarga de llenar la matriz de salarios con numeros aleatorios.
      - TotalPagadoEmpleado: Metodo que se encarga de calcular el total pagado para cada empleado.
      - PromedioMes: Metodo que se encarga de calcular el promedio de cada mes por pago de salarios.
      - TotalPagadoMatriz: Metodo que se encarga de calcular el total pagado en la matriz.
  
    - Empleado: Clase que se encarga de almacenar la informacion de los empleados.
      - Antiguedad
      - Salario

    - Cliente: La clase cliente es quien se va a encargar de realizar la conexion con el servidor y de realizar las peticiones e ingreso de datos.

    - Main (Clase que se encarga de ejecutar el programa)

    - Util (Clase que se encarga de realizar la conexion entre el cliente y el servidor)

- Aprendizaje de la libreria RMI.

1. Peer to peer, arquitectura orientada a servicios (SOA), Enterprise Service Bus (ESB), MOM ó BPM. Seleccionar UNA de las anteriores arquitecturas y  realizar:
    - Ventajas
    - Ejemplo

2. Bibliografias