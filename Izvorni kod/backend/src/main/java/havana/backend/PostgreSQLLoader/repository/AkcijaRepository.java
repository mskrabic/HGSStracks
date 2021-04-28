package havana.backend.PostgreSQLLoader.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.Akcija;

@Repository
public interface AkcijaRepository extends JpaRepository<Akcija,String>{
	
	Optional<Akcija> findBySifakcija(String sifAkcija);
	
	List<Akcija> findByKorimedispecer(String korImeDispecer);
	
	List<Akcija> findByStatusEquals(Akcija.Status status);
}
