/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.Interface;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IEmpresa extends Remote{
    public void llenarMatrizSalarios(int numeroEmpleados) throws RemoteException;

    public double[] totalPagadoEmpleado() throws RemoteException;

    public double promedioMensual()  throws RemoteException;

    public double[] totalPagadoPorEmpleado()  throws RemoteException;



}
