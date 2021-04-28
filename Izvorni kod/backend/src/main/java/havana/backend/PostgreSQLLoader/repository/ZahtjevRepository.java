package havana.backend.PostgreSQLLoader.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.Zahtjev;

@Repository
public interface ZahtjevRepository extends JpaRepository<Zahtjev,String>{
	
	List<Zahtjev> findBySifstanica(String sifStanica);
	
	List<Zahtjev> findBySifnacin(String sifNacin);
	
	List<Zahtjev> findBySifakcija(String sifAkcija);
	
	boolean existsBySifstanicaAndSifakcijaAndSifnacin(String sifStanica, String sifAkcija, String sifNacin);
}
