package havana.backend.PostgreSQLLoader.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.Korisnik;

@Repository
public interface KorisnikRepository extends JpaRepository<Korisnik,String>{
	
	Optional<Korisnik> findByKorisnickoime(String korisnickoIme);
	
	boolean existsByKorisnickoimeAndLozinka(String korisnickoIme,String lozinka);
	
	List<Korisnik> findByStatusEquals(Korisnik.Status status);
	
	List<Korisnik> findByUlogaEquals(Korisnik.Uloga uloga);
	
}

