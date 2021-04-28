package havana.backend.PostgreSQLLoader.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import havana.backend.PostgreSQLLoader.entity.idclass.SpasilacAkcijaId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "spasilacakcija")
@IdClass(SpasilacAkcijaId.class)
public class SpasilacAkcija implements Serializable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "sifakcija", length = 5, nullable = false)
	private String sifakcija;
	
	@Id
	@Column(name = "korimespasilac", length = 25, nullable = false)
	private String korimespasilac;
}
