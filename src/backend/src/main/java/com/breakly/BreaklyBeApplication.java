package com.breakly;

// Spring Boot application entry point for the Breakly backend services.
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BreaklyBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(BreaklyBeApplication.class, args);
	}

}
