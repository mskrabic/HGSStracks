package havana.backend.PostgreSQLLoader.controller;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.Stanica;
import havana.backend.PostgreSQLLoader.service.StanicaService;


@RestController
@RequestMapping("/api")
public class StanicaController {
	
	@Resource
	private final StanicaService stanicaService;
	
	@Autowired
	public StanicaController(StanicaService stanicaService) {
		this.stanicaService = stanicaService;
	}
	
	@GetMapping("/stanicalist")
	public List<Stanica> Stanice(){
		return stanicaService.listAllStanica();
	}
	
	@PostMapping("/checkstanica")
	public boolean checkStanica(@RequestBody Stanica stanica) {
		return stanicaService.checkIfStanicaExists(stanica.getSifstanica());
	}

	@PostMapping(value = "/createstanica")
	public void create(@RequestBody Stanica stanica) {
		stanicaService.registerStanica(stanica);
	}
	@PutMapping(value = "/updatestanica")
	public void update(@RequestBody Stanica stanica) {
		stanicaService.updateStanica(stanica);
	}
	@PostMapping(value = "/deletestanica")
	public void delete(@RequestBody Stanica stanica) {
		stanicaService.deleteStanica(stanica);
	}
	
	@PostMapping(value ="/stanicadata")
	public Stanica findStanicaById(@RequestBody Stanica stanica) {
		return (Stanica) this.stanicaService.findStanica(stanica.getSifstanica());
	}
	
	@PostMapping(value="/stanicaSpasilacList")
	public List<Spasilac> listSpasioci(@RequestBody String sifStanica) {
		return this.stanicaService.listAllSpasioci(sifStanica);
	}
	
	@GetMapping(value="/leaderlist")
	public List<String> listLeaders() {
		return stanicaService.listLeaders();
	}
	
	@GetMapping(value="/countavailable")
	public HashMap<String, Integer> availableRescuers() {
		return stanicaService.availableRescuers();
	}

}
