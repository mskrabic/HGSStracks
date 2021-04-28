package havana.backend.PostgreSQLLoader.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import havana.backend.PostgreSQLLoader.entity.Korisnik;
import havana.backend.PostgreSQLLoader.repository.KorisnikRepository;
import havana.backend.PostgreSQLLoader.service.KorisnikService;

@Service
public class KorisnikServiceImpl implements KorisnikService {

	private KorisnikRepository repository;
	//private PasswordEncoder passwordEncoder;

	/*
	 * @Autowired public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
	 * this.passwordEncoder = passwordEncoder; }
	 */

	@Autowired
	public KorisnikServiceImpl(KorisnikRepository repository) {
		this.repository = repository;
	}

	@Override
	public Korisnik registerKorisnik(Korisnik korisnik) {
		if (checkIfKorisnickoimeExists(korisnik.getKorisnickoime()))
			throw new UsernameNotFoundException("User with username " + korisnik.getKorisnickoime() + " already exists");
		return repository.save(korisnik);
	}

	
	public boolean checkIfKorisnickoimeExists(String username) {
		return repository.findByKorisnickoime(username).isPresent();
	}

	@Override
	public boolean checkIfMatch(String korisnickoIme, String lozinka) {
		return repository.existsByKorisnickoimeAndLozinka(korisnickoIme, lozinka);
	}

	@Override
	public List<Korisnik> listAllKorisnik() {
		return repository.findAll();
	}

	@Override
	public List<Korisnik> listAllZahtjevPoslan() {
		return repository.findByStatusEquals(Korisnik.Status.Zahtjev_poslan);
	}

	@Override
	public Korisnik updateKorisnik(Korisnik korisnik) {
		return repository.save(korisnik);
	}

	@Override
	public void deleteKorisnik(String korisnickoime) {
		repository.deleteById(korisnickoime);
	}

	@Override
	public UserDetails loadUserByUsername(String korisnickoIme) throws UsernameNotFoundException {
		Korisnik user = repository.findByKorisnickoime(korisnickoIme)
				.orElseThrow(() -> new UsernameNotFoundException(korisnickoIme + " not found"));
		return user;
	}

	@Override
	public boolean checkIfKorisnikExists(String korisnickoIme) {
		return repository.existsById(korisnickoIme);
	}

	/*
	 * @Override public String passwordEncoder(String password) { return
	 * passwordEncoder.encode(password); }
	 */

}
