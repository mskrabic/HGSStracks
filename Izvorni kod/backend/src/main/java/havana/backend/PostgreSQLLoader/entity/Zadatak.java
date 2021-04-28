package havana.backend.PostgreSQLLoader.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "zadatak")
public class Zadatak {
	@Id
    @SequenceGenerator(name="zadatak_sifzadatak_seq",
                       sequenceName="zadatak_sifzadatak_seq",
                       allocationSize=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
                    generator="zadatak_sifzadatak_seq")
	@Column(name = "sifzadatak")
	private int sifzadatak;
	
	@Column(name = "nazivzadatak", length = 50, nullable = false)
	private String nazivzadatak;
	
	@Column(name = "korimedispecer", length = 25, nullable = false)
	private String korimedispecer;
	
	@Column(name = "korimespasilac", length = 25, nullable = false)
	private String korimespasilac;
	
	@Column(name = "sifakcija", length = 5, nullable = false)
	private String sifakcija;
	
	@Column(name = "komentar", length = 100, nullable = false)
	private String komentar;
	
	@Column(name="lokacijasirina")
	private BigDecimal lokacijasirina;
	
	@Column(name="lokacijaduzina")
	private BigDecimal lokacijaduzina;
	
	@Column(name="pocetnalokacijasirina")
	private BigDecimal pocetnalokacijasirina;
	
	@Column(name="pocetnalokacijaduzina")
	private BigDecimal pocetnalokacijaduzina;
	
	@ManyToOne
	@JoinColumn(name = "sifakcija", insertable = false, updatable = false)
	private Akcija akcija;
}
