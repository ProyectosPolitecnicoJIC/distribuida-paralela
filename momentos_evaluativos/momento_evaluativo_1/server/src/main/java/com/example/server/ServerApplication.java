package com.example.server;
import com.example.implement.EmpresaImpl;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) throws RemoteException {
		Registry reg = LocateRegistry.createRegistry(1099);

		// Crear e implementar el objeto remoto
		EmpresaImpl empresaImplement = new EmpresaImpl();
		reg.rebind("empresa", empresaImplement);

		System.out.println("Objeto remoto 'empresa' registrado correctamente.");

		SpringApplication.run(ServerApplication.class, args);


	}

}
