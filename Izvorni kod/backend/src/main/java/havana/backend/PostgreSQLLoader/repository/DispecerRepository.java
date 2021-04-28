package havana.backend.PostgreSQLLoader.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.Dispecer;

@Repository
public interface DispecerRepository extends JpaRepository<Dispecer,String>{
	
	Optional<Dispecer> findByKorisnickoime(String korisnickoIme);
}
