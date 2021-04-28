package havana.backend.PostgreSQLLoader.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.SpasilacAkcija;

@Repository
public interface SpasilacAkcijaRepository extends JpaRepository<SpasilacAkcija,String>{
	
	List<SpasilacAkcija> findByKorimespasilac(String korImeSpasilac);
	
	List<SpasilacAkcija> findBySifakcija(String sifAkcija);
}