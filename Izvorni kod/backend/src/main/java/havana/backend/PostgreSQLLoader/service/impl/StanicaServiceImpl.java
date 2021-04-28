package havana.backend.PostgreSQLLoader.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import havana.backend.PostgreSQLLoader.entity.Spasilac;
import havana.backend.PostgreSQLLoader.entity.Stanica;
import havana.backend.PostgreSQLLoader.repository.SpasilacRepository;
import havana.backend.PostgreSQLLoader.repository.StanicaRepository;
import havana.backend.PostgreSQLLoader.service.StanicaService;

@Service
public class StanicaServiceImpl implements StanicaService {
	
	
	private StanicaRepository repository;
	private SpasilacRepository repSpa;
	
	@Autowired
	public StanicaServiceImpl(StanicaRepository repository, SpasilacRepository repSpa) {
		this.repository = repository;
		this.repSpa = repSpa;
	}
	

	@Override
	public Stanica registerStanica(Stanica stanica) {
		if (checkIfStanicaExists(stanica.getSifstanica()))
			throw new UsernameNotFoundException("Station with id " + stanica.getSifstanica() + " already exists");
		return repository.save(stanica);
	}

	@Override
	public boolean checkIfStanicaExists(String sifstanica) {
		return repository.findBySifstanica(sifstanica).isPresent();
	}


	@Override
	public List<Stanica> listAllStanica() {
		return repository.findAll();
	}

	@Override
	public Stanica updateStanica(Stanica stanica) {
		return repository.save(stanica);
	}

	@Override
	public void deleteStanica(Stanica stanica) {
		repository.deleteById(stanica.getSifstanica());
		
	}


	@Override
	public List<Spasilac> listAllSpasioci(String sifStanica) {
		return repSpa.findBySifstanica(sifStanica);
	}


	@Override
	public Stanica findStanica(String sifra) {
		Stanica stanica = repository.findBySifstanica(sifra)
				.orElseThrow(() -> new UsernameNotFoundException("Station with id " + sifra + " not found"));
		System.out.println(stanica.getKorimevoditelj() + stanica.getNazivstanica() + stanica.getSifstanica());
		return stanica;
	}


	@Override
	public List<String> listLeaders() {
		return repository.findLeaders();
	}


	@Override
	public HashMap<String, Integer> availableRescuers() {
		List<Stanica> list = repository.findAll();
		HashMap<String, Integer> result = new HashMap<>();
		for (int i = 0; i < list.size(); i++) {
			int count = repSpa.findBySifstanica(list.get(i).getSifstanica()).stream()
							.filter(spasilac -> spasilac.isDostupan() && spasilac.getSiftrenutneakcije() == null)
							.mapToInt(v -> 1)
							.sum();
			result.put(list.get(i).getNazivstanica(), count);
		}
		return result;		
	}
}
