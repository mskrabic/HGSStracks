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
@Table(name = "dispecer")
public class Dispecer {
	@Id
	@Column(name="korisnickoime", length = 25, nullable = false)
	private String korisnickoime;
}
