package havana.backend.PostgreSQLLoader.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import havana.backend.PostgreSQLLoader.entity.Akcija;
import havana.backend.PostgreSQLLoader.entity.Dispecer;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.entity.Zahtjev;


public interface DispecerService extends UserDetailsService{
	List<Dispecer> listAllDispecer();
    
    Dispecer updateDispecer(Dispecer dispecer);

    void deleteDispecer(String korisnickoIme);
    
    List<Akcija> listAllAkcije(String korisnickoIme);
    
    Zadatak createZadatak(Zadatak zadatak);
    
    Zadatak updateZadatak (Zadatak zadatak);
    
    void deleteZadatak (int sifZadatak);
    
    Zahtjev createZahtjev(Zahtjev zahtjev);
    
    Zahtjev updateZahtjev (Zahtjev zahtjev);
    
    void deleteZahtjev (Zahtjev zahtjev);
    
}
