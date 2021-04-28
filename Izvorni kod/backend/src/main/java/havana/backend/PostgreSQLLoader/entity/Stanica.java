package havana.backend.PostgreSQLLoader.entity;

import java.math.BigDecimal;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;



@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "stanica")
public class Stanica{
	@Id
	@Column(name="sifstanica", length = 5, nullable = false)
	private String sifstanica;
	
	@Column(name = "nazivstanica", length = 25, nullable = false)
	private String nazivstanica;
	
	@Column(name="korimevoditelj", length = 25, nullable=false)
	private String korimevoditelj;
	
	@Column(name="lokacijasirina")
	private BigDecimal lokacijasirina;
	
	@Column(name="lokacijaduzina")
	private BigDecimal lokacijaduzina;
	
}
