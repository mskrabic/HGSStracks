package havana.backend.PostgreSQLLoader.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "korisnik")
public class Korisnik implements UserDetails{
	
	private static final long serialVersionUID = 1L;
	
	@Id
	private String korisnickoime;
	@NotNull
	private String lozinka;
	@NotNull
	private String ime;
	@NotNull
	private String prezime;
	@NotNull
	private String brojmob;
	
	@Column(unique=true, nullable=false)
	private String email;
	
	@Enumerated(EnumType.STRING)
	private Uloga uloga;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	@NotNull
	private String urlslika;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(this.getUloga().name()));
        return authorities;
	}
	@Override
	public String getPassword() {
		return lozinka;
	}
	@Override
	public String getUsername() {
		return korisnickoime;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}

	public enum Uloga{
		Spasilac,Dispecer,Admin;
	}
	
	public enum Status{
		Registriran,Zahtjev_poslan
	}
}
