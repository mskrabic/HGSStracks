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
@Table(name = "postaja")
public class Postaja {
	@Id
    @SequenceGenerator(name="postaja_sifpostaja_seq",
    				   sequenceName="postaja_sifpostaja_seq",
    				   allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,
					generator="postaja_sifpostaja_seq")
	@Column(name = "sifpostaja")
	private int sifpostaja;
	
	@Column(name = "sifakcija", length = 5, nullable = false)
	private String sifakcija;
	
	@Column(name = "nazivpostaja", length = 50, nullable = false)
	private String nazivpostaja;
	
	@Column(name = "lokacijaduzina")
	private BigDecimal lokacijaduzina;
	
	@Column(name = "lokacijasirina")
	private BigDecimal lokacijasirina;
}
