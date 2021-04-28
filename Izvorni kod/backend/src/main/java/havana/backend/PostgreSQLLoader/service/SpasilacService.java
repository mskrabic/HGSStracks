package havana.backend.PostgreSQLLoader.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import havana.backend.PostgreSQLLoader.entity.NacinSpasavanja;
import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.SpasilacNacin;
import havana.backend.PostgreSQLLoader.entity.Stanica;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.entity.Zahtjev;


public interface SpasilacService extends UserDetailsService{
	
    List<Spasilac> listAllSpasilac();
    
    void updateSpasilac(Spasilac spasilac);

    void deleteSpasilac(String korisnickoime);
    
    Spasilac findSpasilac(String korisnickoime);
    
    List<Spasilac> listAvailableLeadersForStation(Stanica stanica);
    
    List<NacinSpasavanja> listNaciniAll(String korImeSpasilac);

	List<Spasilac> listActiveRescuers(String sifakcija);

	void updateNacini(SpasilacNacin[] nacini);
	
	List<Zadatak> listZadaci(String korImeSpasilac);
	
	List<Zahtjev> listZahtjevi(String sifStanica);

	List<Spasilac> listAvailableLeaders();
    
    //String passwordEncoder(String password);

}
