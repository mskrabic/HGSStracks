package havana.backend.PostgreSQLLoader.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import havana.backend.PostgreSQLLoader.entity.Postaja;

public interface PostajaRepository extends JpaRepository<Postaja,Integer>{
	
	Optional<Postaja> findBySifpostaja(int i);
	
	List<Postaja> findBySifakcija(String sifAkcija);
}
