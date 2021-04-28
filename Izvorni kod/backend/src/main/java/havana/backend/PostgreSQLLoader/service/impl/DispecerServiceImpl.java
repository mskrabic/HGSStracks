package havana.backend.PostgreSQLLoader.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import havana.backend.PostgreSQLLoader.entity.Akcija;
import havana.backend.PostgreSQLLoader.entity.Dispecer;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.entity.Zahtjev;
import havana.backend.PostgreSQLLoader.repository.AkcijaRepository;
import havana.backend.PostgreSQLLoader.repository.DispecerRepository;
import havana.backend.PostgreSQLLoader.repository.ZadatakRepository;
import havana.backend.PostgreSQLLoader.repository.ZahtjevRepository;
import havana.backend.PostgreSQLLoader.service.DispecerService;

@Service
public class DispecerServiceImpl implements DispecerService {
	
	private DispecerRepository repository;
	private AkcijaRepository repAkcije;
	private ZadatakRepository repZadatak;
	private ZahtjevRepository repZahtjev;
	
	@Autowired
	public DispecerServiceImpl(DispecerRepository repository, AkcijaRepository repAkcije, ZadatakRepository repZadatak, ZahtjevRepository repZahtjev) {
		this.repository = repository;
		this.repAkcije = repAkcije;
		this.repZadatak = repZadatak;
		this.repZahtjev = repZahtjev;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Dispecer user = repository.findByKorisnickoime(username).orElseThrow(() -> new UsernameNotFoundException(username + " not found"));
		return (UserDetails) user;
	}

	@Override
	public List<Dispecer> listAllDispecer() {
		return repository.findAll();
	}

	@Override
	public Dispecer updateDispecer(Dispecer dispecer) {
		return repository.save(dispecer);
	}

	@Override
	public void deleteDispecer(String korisnickoIme) {
		repository.deleteById(korisnickoIme);
	}

	@Override
	public List<Akcija> listAllAkcije(String korisnickoIme) {
		return repAkcije.findByKorimedispecer(korisnickoIme);
	}

	@Override
	public Zadatak createZadatak(Zadatak zadatak) {
		return repZadatak.save(zadatak);	
	}

	@Override
	public Zadatak updateZadatak(Zadatak zadatak) {
		if(!repZadatak.existsBySifzadatak(zadatak.getSifzadatak()))
			throw new UsernameNotFoundException("Zadatak sa šifrom " + zadatak.getSifzadatak() + " ne postoji");
		return repZadatak.save(zadatak);
	}

	@Override
	public void deleteZadatak(int sifZadatak) {
		if(!repZadatak.existsBySifzadatak(sifZadatak))
			throw new UsernameNotFoundException("Zadatak sa šifrom " + sifZadatak + " ne postoji");
		repZadatak.deleteById(sifZadatak);		
	}

	@Override
	public Zahtjev createZahtjev(Zahtjev zahtjev) {
		if(repZahtjev.existsBySifstanicaAndSifakcijaAndSifnacin(zahtjev.getSifstanica(), zahtjev.getSifakcija(), zahtjev.getSifnacin()))
			throw new UsernameNotFoundException("Zahtjev je već poslan");
		return repZahtjev.save(zahtjev);	
	}

	@Override
	public Zahtjev updateZahtjev(Zahtjev zahtjev) {
		if(!repZahtjev.existsBySifstanicaAndSifakcijaAndSifnacin(zahtjev.getSifstanica(), zahtjev.getSifakcija(), zahtjev.getSifnacin()))
			throw new UsernameNotFoundException("Zahtjev ne postoji");
		return repZahtjev.save(zahtjev);
	}

	@Override
	public void deleteZahtjev(Zahtjev zahtjev) {
		if(!repZahtjev.existsBySifstanicaAndSifakcijaAndSifnacin(zahtjev.getSifstanica(), zahtjev.getSifakcija(), zahtjev.getSifnacin()))
			throw new UsernameNotFoundException("Zahtjev ne postoji");
		repZahtjev.delete(zahtjev);
	}
}
