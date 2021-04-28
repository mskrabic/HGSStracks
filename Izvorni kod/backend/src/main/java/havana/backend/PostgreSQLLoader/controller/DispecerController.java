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
import havana.backend.PostgreSQLLoader.entity.Dispecer;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.entity.Zahtjev;
import havana.backend.PostgreSQLLoader.service.DispecerService;

@RestController
@RequestMapping("/api")
public class DispecerController {
	@Resource
	private final DispecerService dispecerService;
	
	@Autowired
	public DispecerController(DispecerService dispecerService) {
		this.dispecerService = dispecerService;
	}
	
	@GetMapping("/dispecerlist")
	public List<Dispecer> Dispeceri(){
		return dispecerService.listAllDispecer();
	}
	
	@PostMapping("/dispecerAkcijaList")
	public List<Akcija> Akcije(@RequestBody String korisnickoIme) {
		return dispecerService.listAllAkcije(korisnickoIme);
	}
	
	@PostMapping("/createzadatak")
	public Zadatak createZadatak(@RequestBody Zadatak zadatak) {
		return dispecerService.createZadatak(zadatak);
	}
	
	@PutMapping("/updatezadatak")
	public Zadatak updateZadatak(@RequestBody Zadatak zadatak) {
		return dispecerService.updateZadatak(zadatak);
	}
	
	@DeleteMapping("/deletezadatak")
	public void deleteZadatak(@RequestBody Zadatak zadatak) {
		dispecerService.deleteZadatak(zadatak.getSifzadatak());
	}
	
	@PostMapping("/createzahtjev")
	public Zahtjev createZahtjev(@RequestBody Zahtjev zahtjev) {
		return dispecerService.createZahtjev(zahtjev);
	}
	
	@PutMapping("/updatezahtjev")
	public Zahtjev updateZahtjev(@RequestBody Zahtjev zahtjev) {
		return dispecerService.updateZahtjev(zahtjev);
	}
	
	@DeleteMapping("/deletezahtjev")
	public void deleteZahtjev(@RequestBody Zahtjev zahtjev) {
		dispecerService.deleteZahtjev(zahtjev);
	}
}
