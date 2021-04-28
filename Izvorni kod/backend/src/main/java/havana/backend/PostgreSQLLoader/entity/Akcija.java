package havana.backend.PostgreSQLLoader.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "akcija")
public class Akcija {
	@Id
	@Column(name = "sifakcija", length = 5, nullable = false)
	private String sifakcija;
	
	@Column(name = "nazivakcija", length = 25, nullable = false)
	private String nazivakcija;
	
	@Column(name = "infnestalaosoba", length = 100, nullable = false)
	private String infnestalaosoba;
	
	@Column(name = "korimedispecer", length = 25, nullable = false)
	private String korimedispecer;
	
	@Column(name = "status", nullable = false)
	@Enumerated(EnumType.STRING)
	private Status status;
	
	@Column(name = "komentar", length = 100)
	private String komentar;
	
	@Column(name = "lokacijaduzina")
	private BigDecimal lokacijaduzina;
	
	@Column(name = "lokacijasirina")
	private BigDecimal lokacijasirina;
	
	@Column(name = "osobapronadena")
	private boolean osobapronadena;
	
	public enum Status {
		U_tijeku, Zavrsena
	}
	
}
