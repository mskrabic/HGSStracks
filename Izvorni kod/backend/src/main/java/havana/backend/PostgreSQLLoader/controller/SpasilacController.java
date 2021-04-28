package havana.backend.PostgreSQLLoader.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import havana.backend.PostgreSQLLoader.entity.Akcija;
import havana.backend.PostgreSQLLoader.entity.NacinSpasavanja;
import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.SpasilacNacin;
import havana.backend.PostgreSQLLoader.entity.Stanica;
import havana.backend.PostgreSQLLoader.entity.Zadatak;
import havana.backend.PostgreSQLLoader.entity.Zahtjev;
import havana.backend.PostgreSQLLoader.service.SpasilacService;

@RestController
@RequestMapping("/api")
public class SpasilacController {

	@Resource
	private final SpasilacService spasilacService;
	
	@Autowired
	public SpasilacController(SpasilacService spasilacService) {
		this.spasilacService = spasilacService;
	}
	

	@GetMapping("/spasilaclist")
	public List<Spasilac> Spasioci(){
		return spasilacService.listAllSpasilac();
	}
	
	@PostMapping("/spasilacdata")
	public Spasilac findSpasilacById(@RequestBody Spasilac spasilac) {
		return (Spasilac) this.spasilacService.findSpasilac(spasilac.getKorisnickoime());
	}
	
	@PostMapping("/updatespasilac")
	public void updateSpasilac(@RequestBody Spasilac spasilac) {
		spasilacService.updateSpasilac(spasilac);
	}
	
	@PostMapping("/availableleaders")
	public List<Spasilac> findAvailableLeadersForStation(@RequestBody Stanica stanica) {
		return spasilacService.listAvailableLeadersForStation(stanica);
	}
	
	@GetMapping("/availableleadersall")
	public List<Spasilac> findAvailableLeaders() {
		return spasilacService.listAvailableLeaders();
	}
	
	@PostMapping("/currentaction")
	public List<Spasilac> findActiveRescuers(@RequestBody Akcija akcija) {
		return spasilacService.listActiveRescuers(akcija.getSifakcija());
	}
	
	@PostMapping("/spasilacnacinlist")
	public List<NacinSpasavanja> Nacini(@RequestBody Spasilac spasilac) {
		return spasilacService.listNaciniAll(spasilac.getKorisnickoime());
	}
	
	@PostMapping("/updatenacini")
	public void updateNacini(@RequestBody SpasilacNacin[] nacini) {

		spasilacService.updateNacini(nacini);
		
	}
	
	@PostMapping("/zadacispasioca")
	public List<Zadatak> Zadaci(@RequestBody Spasilac spasilac) {
		return spasilacService.listZadaci(spasilac.getKorisnickoime());
	}
	
	@PostMapping("/zahtjevispasioca")
	public List<Zahtjev> Zahtjevi(@RequestBody Spasilac spasilac) {
		return spasilacService.listZahtjevi(spasilac.getSifstanica());
	}
}
