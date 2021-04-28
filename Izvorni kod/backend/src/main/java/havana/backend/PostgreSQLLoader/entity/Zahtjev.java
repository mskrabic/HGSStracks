package havana.backend.PostgreSQLLoader.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import havana.backend.PostgreSQLLoader.entity.idclass.ZahtjevId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name="zahtjev")
@IdClass(ZahtjevId.class)
public class Zahtjev {
	@Id
	@Column(name = "sifstanica", length = 5, nullable = false)
	private String sifstanica;
	
	@Id
	@Column(name = "sifakcija", length = 5, nullable = false)
	private String sifakcija;
	
	@Id
	@Column(name = "sifnacin", length = 5, nullable = false)
	private String sifnacin;
	
	@ManyToOne
	@JoinColumn(name = "sifnacin", insertable = false, updatable = false)
	private NacinSpasavanja nacin;
	
	@ManyToOne
	@JoinColumn(name = "sifakcija", insertable = false, updatable = false)
	private Akcija akcija;
}
