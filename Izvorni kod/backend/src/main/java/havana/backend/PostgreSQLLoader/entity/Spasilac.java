package havana.backend.PostgreSQLLoader.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "spasilac")
public class Spasilac {
	@Id
	@Column(name = "korisnickoime", length = 25, nullable = false)
	private String korisnickoime;

	@Column(name = "sifstanica", length = 5)
	private String sifstanica;
	
	@Column(name = "dostupan", nullable = false)
	private boolean dostupan;
	
    @Column(name = "siftrenutneakcije", length = 5)
	private String siftrenutneakcije;
    
    @Column(name = "lokacijaduzina")
	private BigDecimal lokacijaduzina;
	
	@Column(name = "lokacijasirina")
	private BigDecimal lokacijasirina;
   
	@ManyToOne
	@JoinColumn(name = "korisnickoime", insertable = false, updatable = false)
	private Korisnik korisnik;
	
	@ManyToOne
	@JoinColumn(name = "siftrenutneakcije", insertable = false, updatable = false)
	private Akcija trenutnaakcija;
}
