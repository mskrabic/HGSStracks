package havana.backend.PostgreSQLLoader.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.Stanica;

@Repository
public interface StanicaRepository extends JpaRepository<Stanica,String>{
	
	Optional<Stanica> findBySifstanica(String sifstanica);
	
	Optional<Stanica> findByKorimevoditelj(String korimevoditelj);

	@Query("select s.korimevoditelj FROM Stanica s WHERE s.korimevoditelj IS NOT NULL")
	List<String> findLeaders();
}
