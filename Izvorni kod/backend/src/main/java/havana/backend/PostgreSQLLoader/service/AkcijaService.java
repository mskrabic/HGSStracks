package havana.backend.PostgreSQLLoader.service;

import java.util.List;

import havana.backend.PostgreSQLLoader.entity.Akcija;
import havana.backend.PostgreSQLLoader.entity.Komentar;
import havana.backend.PostgreSQLLoader.entity.Postaja;
import havana.backend.PostgreSQLLoader.entity.Zadatak;

public interface AkcijaService {
	Akcija registerAkcija(Akcija akcija);
    
    List<Akcija> listAllAkcija();
    
    Akcija updateAkcija(Akcija akcija);
    
    Akcija findAkcija(String sifakcija);

    void deleteAkcija(Akcija akcija);
    
    List<Akcija> listZavrseneAkcije();
    
    List<Akcija> listAkcijeUTijeku();
    
    List<Postaja> listPostaje(String sifAkcija);
    
    Postaja createPostaja(Postaja postaja);
    
    void deletePostaja(int sifPostaja);
    
    List<Komentar> listKomentari(String sifAkcija);
    
    Komentar createKomentar(Komentar komentar);
    
    void deleteKomentar(int sifKomentar);
    
    List<Zadatak> listZadaci(String sifAkcija);

	boolean checkIfAkcijaExists(String sifakcija);
}
