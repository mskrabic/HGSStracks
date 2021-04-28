package havana.backend.PostgreSQLLoader.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import havana.backend.PostgreSQLLoader.entity.Akcija;
import havana.backend.PostgreSQLLoader.entity.Komentar;
import havana.backend.PostgreSQLLoader.entity.Postaja;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.service.AkcijaService;

@RestController
@RequestMapping("/api")
public class AkcijaController {

	@Resource
	private final AkcijaService akcijaService;
	
	@Autowired
	public AkcijaController(AkcijaService akcijaService) {
		this.akcijaService = akcijaService;
	}
	
	@PostMapping("/checkakcija")
	public boolean checkIfAkcijaExists(@RequestBody Akcija akcija) {
		return akcijaService.checkIfAkcijaExists(akcija.getSifakcija());
	}
	@GetMapping("/akcijalist")
	public List<Akcija> Akcije(){
		return akcijaService.listAllAkcija();
	}
	
	@PostMapping("/akcijadata")
	public Akcija findAkcija(@RequestBody Akcija akcija) {
		return akcijaService.findAkcija(akcija.getSifakcija());
	}
	
	@PostMapping(value = "/createakcija")
	public void create(@RequestBody Akcija akcija) {
		akcijaService.registerAkcija(akcija);
	}
	@PutMapping(value = "/updateakcija")
	public void update(@RequestBody Akcija akcija) {
		akcijaService.updateAkcija(akcija);
	}
	@PostMapping(value = "/deleteakcija")
	public void delete(@RequestBody Akcija akcija) {
		akcijaService.deleteAkcija(akcija);
	}
	@GetMapping(value = "/zavrseneakcije")
	public List<Akcija> zavrseneAkcije() {
		return akcijaService.listZavrseneAkcije();
	}
	@GetMapping(value = "/akcijeutijeku")
	public List<Akcija> akcijeUTijeku() {
		return akcijaService.listAkcijeUTijeku();
	}
	
	@PostMapping(value = "/akcijapostaje")
	public List<Postaja> Postaje(@RequestBody Akcija akcija) {
		return akcijaService.listPostaje(akcija.getSifakcija());
	}
	
	@PostMapping(value = "/createpostaja")
	public Postaja createPostaja(@RequestBody Postaja postaja) {
		return akcijaService.createPostaja(postaja);
	}
	
	@DeleteMapping(value = "/deletepostaja")
	public void deletePostaja(@RequestBody Postaja postaja) {
		akcijaService.deletePostaja(postaja.getSifpostaja());
	}
	
	@PostMapping(value = "/akcijakomentari")
	public List<Komentar> Komentari(@RequestBody Akcija akcija) {
		return akcijaService.listKomentari(akcija.getSifakcija());
	}
	
	@PostMapping(value = "/createkomentar")
	public Komentar createKomentar(@RequestBody Komentar komentar) {
		return akcijaService.createKomentar(komentar);
	}
	
	@DeleteMapping(value = "/deletekomentar")
	public void deleteKomentar(@RequestBody Komentar komentar) {
		akcijaService.deleteKomentar(komentar.getSifkomentar());
	}
	
	@PostMapping(value = "/akcijazadaci")
	public List<Zadatak> Zadaci(@RequestBody Akcija akcija) {
		return akcijaService.listZadaci(akcija.getSifakcija());
	}
}
