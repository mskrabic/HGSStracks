package havana.backend.PostgreSQLLoader.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import havana.backend.PostgreSQLLoader.entity.Korisnik;
import havana.backend.PostgreSQLLoader.service.KorisnikService;


@RestController
@RequestMapping("/api")
public class KorisnikController {

	@Resource
	private final KorisnikService korisnikService;

	@Autowired
	public KorisnikController(KorisnikService korisnikService) {
		this.korisnikService = korisnikService;
	}

	@GetMapping("/userlist")
	public List<Korisnik> Korisnici(){
		return korisnikService.listAllKorisnik();
	}

	@PostMapping(value ="/userdata")
	public Korisnik get(@RequestBody Korisnik korisnik) {
		return (Korisnik) this.korisnikService.loadUserByUsername(korisnik.getKorisnickoime());
	}
	@GetMapping("/requestsentlist")
	public List<Korisnik> requestSent(){
		return korisnikService.listAllZahtjevPoslan();
	}
	@PostMapping(value = "/createkorisnik")
	public void create(@RequestBody Korisnik korisnik) {
		korisnikService.registerKorisnik(korisnik);
	}
	@PutMapping(value = "/updatekorisnik")
	public void update(@RequestBody Korisnik korisnik) {
		korisnikService.updateKorisnik(korisnik);
	}
	
	@PostMapping(value = "/deletekorisnik")
	public void delete(@RequestBody Korisnik korisnik) {
		korisnikService.deleteKorisnik(korisnik.getKorisnickoime());
	}
	
	@PostMapping(value = "/check")
	public boolean KorisnikPostoji(@RequestBody Korisnik korisnik) {
		return korisnikService.checkIfMatch(korisnik.getKorisnickoime(),korisnik.getLozinka());
	}
	
	@PostMapping(value = "/checkkorisnik")
	public boolean exists(@RequestBody Korisnik korisnik) {
		return korisnikService.checkIfKorisnikExists(korisnik.getKorisnickoime());
	}
}
