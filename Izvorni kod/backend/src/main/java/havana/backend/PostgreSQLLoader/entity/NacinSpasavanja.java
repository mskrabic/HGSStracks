package havana.backend.PostgreSQLLoader.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "nacinspasavanja")
public class NacinSpasavanja {
	@Id
	@Column(length = 5, name = "sifnacin", nullable = false)
	private String sifnacin;
	
	@Column(length = 25, name = "imenacin", nullable = false)
	private String imenacin;
	
	@Column(name = "intenzitet", nullable = false)
	private Integer intenzitet;
	
	@Column(name = "velicina", nullable = false)
	private Integer velicina;
}
