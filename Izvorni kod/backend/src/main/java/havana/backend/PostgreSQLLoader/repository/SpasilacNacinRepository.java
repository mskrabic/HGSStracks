package havana.backend.PostgreSQLLoader.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import havana.backend.PostgreSQLLoader.entity.SpasilacNacin;

@Repository
public interface SpasilacNacinRepository extends JpaRepository<SpasilacNacin,String>{
	
	List<SpasilacNacin> findByKorimespasilac(String korImeSpasilac);
	
	List<SpasilacNacin> findBySifnacin(String SifNacin);
}
