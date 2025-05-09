package com.example.client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.rmi.Naming;
import java.rmi.NotBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.stream.Stream;

import com.example.*;
public class Client {

    public static void main(String[] args) throws IOException{

        int employeeQuant;
        int workedMonths;
    
        /**
         *
         */
        try{
            BufferedReader buffer = new BufferedReader(new InputStreamReader(System.in));

            // Toma de valores 

            System.out.println("Digite la cantidad de empleados: ");
            employeeQuant = Integer.parseInt(buffer.readLine());
            System.out.println("Digite la cantidad de meses trabajados: ");
            workedMonths = Integer.parseInt(buffer.readLine());

            // binding con la instancia de RMI
            Remote empresaRemote = Naming.lookup("rmi://localhost:1099/empresa");
            IEmpresa empresa = (IEmpresa) empresaRemote;

            // Llamado a los metodos desde el cliente
            empresa.llenarMatrizSalarios(employeeQuant, workedMonths);
            double[] totalPagadoEmpleado = empresa.totalPagadoEmpleado();
            double promedioMensual = empresa.promedioMensual();
            double[] totalPagadoPorEmpleado = empresa.totalPagadoPorEmpleado();

            // Mostrar valores por pantalla 
            System.out.println("Total pagado a empleado: ");
            Stream.of(totalPagadoEmpleado).forEach(System.out::println);
            System.out.println("Promedio mensual: " + promedioMensual);
            System.out.println("Total pagado por empleado: ");
            Stream.of(totalPagadoPorEmpleado).forEach(System.out::println);
        }catch(
        RemoteException e)
        {
            System.out.println("Error: " + e.getMessage());
        } catch (NotBoundException e) {
            e.printStackTrace();
        } catch (java.net.MalformedURLException e) {
            e.printStackTrace();
        }

    }

    

}
