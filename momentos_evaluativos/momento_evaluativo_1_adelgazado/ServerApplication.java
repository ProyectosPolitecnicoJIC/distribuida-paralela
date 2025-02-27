import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ServerApplication {

	public static void main(String[] args) throws RemoteException {
		Registry reg = LocateRegistry.createRegistry(1100);

		// Crear e implementar el objeto remoto
		EmpresaImpl empresaImplement = new EmpresaImpl();
		reg.rebind("empresa", empresaImplement);

		System.out.println("Objeto remoto 'empresa' registrado correctamente.");



	}

}
