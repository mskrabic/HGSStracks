
package havana.backend.PostgreSQLLoader.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import havana.backend.PostgreSQLLoader.service.KorisnikService;

@Configuration

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private KorisnikService userDetailsService;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable().authorizeRequests()
				//.antMatchers("/api/check","/api/create","/api/userlist","/api/requestsentlist")
				.antMatchers("/api/*").permitAll().anyRequest().authenticated()
//				.and().formLogin().loginProcessingUrl("/api/check")
//				.successHandler(((request, response, authentication) -> response.setStatus(200)))
//				.failureHandler(((request, response, authentication) -> response.setStatus(401)))
//				.and().rememberMe().rememberMeParameter("rememberMe").key("uniqueAndSecret")
				.and().headers().frameOptions().disable();
	}

	protected void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

}
