package havana.backend.PostgreSQLLoader.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.Zadatak;

@Repository
public interface ZadatakRepository extends JpaRepository<Zadatak,Integer>{
	
	Optional<Zadatak> findBySifzadatak(String sifZadatak);
	
	List<Zadatak> findByKorimespasilac(String KorImeSpasilac);
	
	boolean existsBySifzadatak(int sifZadatak);
	
	List<Zadatak> findBySifakcija(String sifAkcija);
}
