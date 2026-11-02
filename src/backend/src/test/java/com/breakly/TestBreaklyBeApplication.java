package com.breakly;

import org.springframework.boot.SpringApplication;

public class TestBreaklyBeApplication {

	public static void main(String[] args) {
		SpringApplication.from(BreaklyBeApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
