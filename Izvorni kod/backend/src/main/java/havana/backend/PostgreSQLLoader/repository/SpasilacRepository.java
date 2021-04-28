package havana.backend.PostgreSQLLoader.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import havana.backend.PostgreSQLLoader.entity.Spasilac;

@Repository
public interface SpasilacRepository extends JpaRepository<Spasilac,String>{
	
	Optional<Spasilac> findByKorisnickoime(String korisnickoIme);
	
	List<Spasilac> findBySifstanica(String stanica);

	@Query("select s from Spasilac s where (s.sifstanica = :sifstanica OR s.sifstanica IS NULL) AND s.korisnickoime NOT IN (select st.korimevoditelj from Stanica st WHERE st.korimevoditelj IS NOT NULL)")
	List<Spasilac> findAvaialableLeadersForStation(@Param("sifstanica")String sifstanica);
	
	@Query("select s from Spasilac s where s.korisnickoime NOT IN (select st.korimevoditelj from Stanica st WHERE st.korimevoditelj IS NOT NULL)")
	List<Spasilac> findAvaialableLeaders();

	  
	@Query(value = "select * from Spasilac s where s.siftrenutneakcije = :sifakcija", 
		   nativeQuery = true)
	List<Spasilac> findActiveRescuers(@Param("sifakcija") String sifakcija);
	
	@Modifying
	@Transactional
	@Query("UPDATE Spasilac s SET s.sifstanica = :sifstanica, s.dostupan = :dostupan, s.siftrenutneakcije = :akcija, s.lokacijasirina = :sirina, s.lokacijaduzina = :duzina WHERE s.korisnickoime = :ime ")
	void update(@Param("ime") String korisnickoime, @Param("sifstanica") String sifstanica, @Param("dostupan") Boolean dostupan, @Param("akcija") String siftrenutneakcije,
			@Param("sirina") BigDecimal lokacijasirina,@Param("duzina") BigDecimal lokacijaduzina);
}
