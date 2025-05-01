//package edu.bilkent.cs319.team9.ta_management_system.config;
//
//
//import edu.bilkent.cs319.team9.ta_management_system.security.JwtAuthenticationFilter;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.NoOpPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.bind.annotation.CrossOrigin;
//
//@CrossOrigin(origins = "http://localhost:3000")
//@Configuration
//public class SecurityConfig {
//
//    @Autowired
//    private JwtAuthenticationFilter jwtFilter;
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//
//    // expose the AuthenticationManager for your /login endpoint
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration ac) throws Exception {
//        return ac.getAuthenticationManager();
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}

package edu.bilkent.cs319.team9.ta_management_system.config;

import edu.bilkent.cs319.team9.ta_management_system.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // expose AuthenticationManager for /api/auth/login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration ac) throws Exception {
        return ac.getAuthenticationManager();
    }

    /**
     * This CorsFilter bean is registered at the very top of the filter chain
     * (because of @Order(HIGHEST_PRECEDENCE)), so it handles preflight OPTIONS
     * and adds the CORS headers before Spring Security sees anything.
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:3000"));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cfg);
        return new CorsFilter(source);
    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(sm -> sm
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                // if you want to completely ban anonymous:
//                // .anonymous(an -> an.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .anyRequest().hasAnyAuthority(
//                                "ROLE_TA",
//                                "ROLE_FACULTY",
//                                "ROLE_FACULTY_MEMBER",
//                                "ROLE_COORDINATOR",
//                                "ROLE_DEAN",
//                                "ROLE_ADMIN",
//                                "ROLE_DEPARTMENT_STAFF"
//                        )
//                )          // ← this ) closes authorizeHttpRequests
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // no CSRF, stateless session
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // disable anonymous so every non-permitted path truly requires auth
                .anonymous(anon -> anon.disable())

                // set up your URL rules
                .authorizeHttpRequests(auth -> auth
                        // allow your login & recover endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        // everything else requires a valid JWT
                        .requestMatchers("/error").permitAll()

                        // for the feedback system
                        .requestMatchers(HttpMethod.POST, "/api/feedback").hasAnyAuthority(
                                "ROLE_TA","ROLE_FACULTY","ROLE_FACULTY_MEMBER",
                                "ROLE_COORDINATOR","ROLE_DEAN","ROLE_DEPARTMENT_STAFF")
                        .requestMatchers(HttpMethod.GET,  "/api/feedback").hasAuthority("ROLE_ADMIN")


                        .anyRequest().authenticated()
                )

                // add your JWT filter before Spring's UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}



