package havana.backend.PostgreSQLLoader.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.NacinSpasavanja;

@Repository
public interface NacinSpasavanjaRepository extends JpaRepository<NacinSpasavanja,String>{
	
	Optional<NacinSpasavanja> findBySifnacin(String SifNacin);
}
