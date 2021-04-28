package havana.backend.PostgreSQLLoader.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import havana.backend.PostgreSQLLoader.entity.Komentar;

public interface KomentarRepository extends JpaRepository<Komentar,Integer>{
	
	Optional<Komentar> findBySifkomentar(int sifKomentar);
	
	List<Komentar> findBySifakcija(String sifAkcija);
}
