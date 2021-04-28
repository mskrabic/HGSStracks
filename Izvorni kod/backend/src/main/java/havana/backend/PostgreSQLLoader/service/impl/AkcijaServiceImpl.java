package havana.backend.PostgreSQLLoader.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import havana.backend.PostgreSQLLoader.entity.Akcija;
import havana.backend.PostgreSQLLoader.entity.Komentar;
import havana.backend.PostgreSQLLoader.entity.Postaja;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.repository.AkcijaRepository;
import havana.backend.PostgreSQLLoader.repository.KomentarRepository;
import havana.backend.PostgreSQLLoader.repository.PostajaRepository;
import havana.backend.PostgreSQLLoader.repository.ZadatakRepository;
import havana.backend.PostgreSQLLoader.service.AkcijaService;

@Service
public class AkcijaServiceImpl implements AkcijaService{
	
	private AkcijaRepository repository;
	private PostajaRepository repPostaja;
	private KomentarRepository repKomentar;
	private ZadatakRepository repZadatak;
	
	@Autowired
	public AkcijaServiceImpl(AkcijaRepository repository, PostajaRepository repPostaja, KomentarRepository repKomentar,  ZadatakRepository repZadatak) {
		this.repository = repository;
		this.repPostaja = repPostaja;
		this.repKomentar = repKomentar;
		this.repZadatak = repZadatak;
	}

	@Override
	public Akcija registerAkcija(Akcija akcija) {
		if (checkIfAkcijaExists(akcija.getSifakcija()))
			throw new UsernameNotFoundException("Action with id " + akcija.getSifakcija() + " already exists");
		return repository.save(akcija);
	}

	@Override
	public boolean checkIfAkcijaExists(String sifakcija) {
		return repository.findBySifakcija(sifakcija).isPresent();
	}

	@Override
	public List<Akcija> listAllAkcija() {
		return repository.findAll();
	}

	@Override
	public Akcija updateAkcija(Akcija akcija) {
		return repository.save(akcija);
	}

	@Override
	public void deleteAkcija(Akcija akcija) {
		repository.deleteById(akcija.getSifakcija());
	}

	@Override
	public Akcija findAkcija(String sifakcija) {
		Akcija akcija = repository.findBySifakcija(sifakcija)
				.orElseThrow(() -> new UsernameNotFoundException(sifakcija + " not found"));
		return akcija;
	}

	@Override
	public List<Akcija> listZavrseneAkcije() {
		return repository.findByStatusEquals(Akcija.Status.Zavrsena);
	}

	@Override
	public List<Akcija> listAkcijeUTijeku() {
		return repository.findByStatusEquals(Akcija.Status.U_tijeku);
	}

	@Override
	public List<Postaja> listPostaje(String sifAkcija) {
		return repPostaja.findBySifakcija(sifAkcija);
	}

	@Override
	public Postaja createPostaja(Postaja postaja) {
		if (repPostaja.findBySifpostaja(postaja.getSifpostaja()).isPresent())
			throw new UsernameNotFoundException("Postaja sa šifrom " + postaja.getSifpostaja() + " već postoji");
		else
			return repPostaja.save(postaja);
	}
	
	@Override
	public void deletePostaja(int sifPostaja) {
		if (!repPostaja.findBySifpostaja(sifPostaja).isPresent())
			throw new UsernameNotFoundException("Postaja sa šifrom " + sifPostaja + " ne postoji");
		else
			repPostaja.deleteById(sifPostaja);
	}

	@Override
	public List<Komentar> listKomentari(String sifAkcija) {
		return repKomentar.findBySifakcija(sifAkcija);
	}

	@Override
	public Komentar createKomentar(Komentar komentar) {
		if (repKomentar.findBySifkomentar(komentar.getSifkomentar()).isPresent())
			throw new UsernameNotFoundException("Komentar sa šifrom " + komentar.getSifkomentar() + " već postoji");
		else
			return repKomentar.save(komentar);
	}

	@Override
	public void deleteKomentar(int sifKomentar) {
		if (!repKomentar.findBySifkomentar(sifKomentar).isPresent())
			throw new UsernameNotFoundException("Komentar sa šifrom " + sifKomentar + " ne postoji");
		else
			repKomentar.deleteById(sifKomentar);
	}

	@Override
	public List<Zadatak> listZadaci(String sifAkcija) {
		return repZadatak.findBySifakcija(sifAkcija);
	}
}
