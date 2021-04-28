package havana.backend.PostgreSQLLoader.service;

import java.util.HashMap;
import java.util.List;

import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.Stanica;


public interface StanicaService {
	
    Stanica registerStanica(Stanica stanica);
    
    List<Stanica> listAllStanica();
    
    List<Spasilac> listAllSpasioci(String sifStanica);
    
    Stanica updateStanica(Stanica stanica);
    
    Stanica findStanica(String sifra);

    void deleteStanica(Stanica Stanica);

	List<String> listLeaders();

	HashMap<String, Integer> availableRescuers();

	boolean checkIfStanicaExists(String sifstanica);
    
    //String passwordEncoder(String password);

}
