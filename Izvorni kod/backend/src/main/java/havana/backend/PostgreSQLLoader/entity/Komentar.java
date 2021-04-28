package havana.backend.PostgreSQLLoader.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "komentar")
public class Komentar {
	@Id
    @SequenceGenerator(name="komentar_sifkomentar_seq",
				       sequenceName="komentar_sifkomentar_seq",
				       allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,
					generator="komentar_sifkomentar_seq")
	@Column(name = "sifkomentar")
	private int sifkomentar;
	
	@Column(name = "korimespasilac", length = 25, nullable = false)
	private String korimespasilac;
	
	@Column(name = "sifakcija", length = 5, nullable = false)
	private String sifakcija;
	
	@Column(name = "komentar", length = 200, nullable = false)
	private String komentar;
	
	@Column(name = "lokacijaduzina")
	private BigDecimal lokacijaduzina;
	
	@Column(name = "lokacijasirina")
	private BigDecimal lokacijasirina;
}
