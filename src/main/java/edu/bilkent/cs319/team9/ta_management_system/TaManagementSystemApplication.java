package edu.bilkent.cs319.team9.ta_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;



import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class
TaManagementSystemApplication {

	public static void main(String[] args) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String raw = "1234";
		System.out.println(encoder.encode(raw));


//		byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
//		String base64Key = Encoders.BASE64.encode(keyBytes);
//		System.out.println(base64Key);




		SpringApplication.run(TaManagementSystemApplication.class, args);
	}

}
