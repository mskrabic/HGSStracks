package havana.backend.PostgreSQLLoader.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;
import havana.backend.PostgreSQLLoader.entity.Korisnik;


public interface KorisnikService extends UserDetailsService{
	
    Korisnik registerKorisnik(Korisnik korisnik);
    
    boolean checkIfMatch(String korisnickoIme,String lozinka);
    
    List<Korisnik> listAllKorisnik();
    
    List<Korisnik> listAllZahtjevPoslan();
    
    Korisnik updateKorisnik(Korisnik korisnik);

    void deleteKorisnik(String korisnickoIme);
    
	boolean checkIfKorisnikExists(String korisnickoIme);
    
    //String passwordEncoder(String password);

}

