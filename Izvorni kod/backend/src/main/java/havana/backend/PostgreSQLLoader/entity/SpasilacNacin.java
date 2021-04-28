package havana.backend.PostgreSQLLoader.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import havana.backend.PostgreSQLLoader.entity.idclass.SpasilacNacinId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name="spasilacnacin")
@IdClass(SpasilacNacinId.class)
public class SpasilacNacin implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "korimespasilac", length = 25, nullable = false)
	private String korimespasilac;
	
	@Id
	@Column(name = "sifnacin", length = 5, nullable = false)
	private String sifnacin;
	
	@ManyToOne
	@JoinColumn(name = "sifnacin", insertable = false, updatable = false)
	private NacinSpasavanja nacin;
}
