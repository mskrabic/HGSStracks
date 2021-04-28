package havana.backend.PostgreSQLLoader.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import havana.backend.PostgreSQLLoader.entity.NacinSpasavanja;
import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.SpasilacNacin;
import havana.backend.PostgreSQLLoader.entity.Stanica;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.entity.Zahtjev;
import havana.backend.PostgreSQLLoader.repository.SpasilacNacinRepository;
import havana.backend.PostgreSQLLoader.repository.SpasilacRepository;
import havana.backend.PostgreSQLLoader.repository.ZadatakRepository;
import havana.backend.PostgreSQLLoader.repository.ZahtjevRepository;
import havana.backend.PostgreSQLLoader.service.SpasilacService;

@Service
public class SpasilacServiceImpl implements SpasilacService {

	private SpasilacRepository repository;
	private SpasilacNacinRepository repSN;
	private ZadatakRepository repZadatak;
	private ZahtjevRepository repZahtjev;
	
	@Autowired
	public SpasilacServiceImpl(SpasilacRepository repository, SpasilacNacinRepository repSN, ZadatakRepository repZadatak, ZahtjevRepository repZahtjev) {
		this.repository = repository;
		this.repSN = repSN;
		this.repZadatak = repZadatak;
		this.repZahtjev = repZahtjev;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Spasilac user = repository.findByKorisnickoime(username).orElseThrow(() -> new UsernameNotFoundException(username + " not found"));
		return (UserDetails) user;
	}

	@Override
	public List<Spasilac> listAllSpasilac() {
		return repository.findAll();
	}

	@Override
	public void updateSpasilac(Spasilac spasilac) {
		repository.update(spasilac.getKorisnickoime(),
							spasilac.getSifstanica(),
							spasilac.isDostupan(), 
							spasilac.getSiftrenutneakcije(),
							spasilac.getLokacijasirina(),
							spasilac.getLokacijaduzina());
		//return repository.save(spasilac);
	}

	@Override
	public void deleteSpasilac(String korisnickoIme) {
		repository.deleteById(korisnickoIme);

	}
	
	@Override
	public List<Spasilac> listAvailableLeadersForStation(Stanica stanica) {
		return repository.findAvaialableLeadersForStation(stanica.getSifstanica());
	}

	@Override
	public List<NacinSpasavanja> listNaciniAll(String korImeSpasilac) {
		return repSN.findByKorimespasilac(korImeSpasilac).stream().map(d -> d.getNacin()).collect(Collectors.toList());
	}
	
	@Override
	public Spasilac findSpasilac(String korisnickoime) {
		Spasilac s = repository.findByKorisnickoime(korisnickoime)
				.orElseThrow(() -> new UsernameNotFoundException(korisnickoime + " not found"));
		return s;
	}

	@Override
	public List<Spasilac> listActiveRescuers(String sifakcija) {
		return repository.findActiveRescuers(sifakcija);
	}

	@Override
	public void updateNacini(SpasilacNacin[] nacini) {
		List<SpasilacNacin> stariNacini = repSN.findAll().stream()
				.filter(n -> n.getKorimespasilac().equals(nacini[0].getKorimespasilac()))
				.collect(Collectors.toList());
		repSN.deleteAll(stariNacini);
		if (nacini[0].getSifnacin() != null)
			repSN.saveAll(Arrays.asList(nacini));
		
	}

	@Override
	public List<Zadatak> listZadaci(String korImeSpasilac) {
		List<Zadatak> lista = this.repZadatak.findByKorimespasilac(korImeSpasilac);
		return lista;
	}

	@Override
	public List<Zahtjev> listZahtjevi(String sifStanica) {
		return repZahtjev.findBySifstanica(sifStanica);
	}

	@Override
	public List<Spasilac> listAvailableLeaders() {
		return repository.findAvaialableLeaders();
	}
}
