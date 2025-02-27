
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.Random;
public class EmpresaImpl extends UnicastRemoteObject  implements IEmpresa {

    private double[][] matrizSalarios;

    private int MESES = 12;

    public EmpresaImpl() throws RemoteException {
        super();
    }

    @Override
    public void llenarMatrizSalarios(int numeroEmpleados, int meses) throws RemoteException {
        matrizSalarios = new double[numeroEmpleados][meses];
        Random random = new Random();

        for (int i = 0; i < numeroEmpleados; i++) {
            for (int j = 0; j < meses; j++) {
                matrizSalarios[i][j] = 1000000 + (4000 * random.nextDouble());
            }
        }
        System.out.println("Matriz de salarios llenada.");
    }

    @Override
    public double[] totalPagadoEmpleado() throws RemoteException {
        if (matrizSalarios == null) throw new RemoteException("La matriz de salarios no ha sido inicializada.");

        double[] totalMensual = new double[MESES];
        for (int mes = 0; mes < MESES; mes++) {
            double suma = 0;
            for (double[] empleado : matrizSalarios) {
                suma += empleado[mes];
            }
            totalMensual[mes] = suma;
        }
        return totalMensual;
    }
    
    @Override
    public double promedioMensual() throws RemoteException {
        if (matrizSalarios == null) throw new RemoteException("La matriz de salarios no ha sido inicializada.");

        double sumaTotal = 0;
        for (double[] empleado : matrizSalarios) {
            for (double salario : empleado) {
                sumaTotal += salario;
            }
        }
        return sumaTotal / (matrizSalarios.length * MESES);
    }

    // Calcula el total pagado a cada empleado durante el año
    @Override
    public double[] totalPagadoPorEmpleado() throws RemoteException {
        if (matrizSalarios == null) throw new RemoteException("La matriz de salarios no ha sido inicializada.");

        double[] totalEmpleado = new double[matrizSalarios.length];
        for (int i = 0; i < matrizSalarios.length; i++) {
            double suma = 0;
            for (double salario : matrizSalarios[i]) {
                suma += salario;
            }
            totalEmpleado[i] = suma;
        }
        return totalEmpleado;
    }

}