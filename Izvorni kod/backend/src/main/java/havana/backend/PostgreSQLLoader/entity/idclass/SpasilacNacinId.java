package havana.backend.PostgreSQLLoader.entity.idclass;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class SpasilacNacinId implements Serializable {
	private static final long serialVersionUID = 1L;

	private String korimespasilac;

    private String sifnacin;
}
