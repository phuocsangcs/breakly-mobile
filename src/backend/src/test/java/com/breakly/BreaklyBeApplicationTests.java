package com.breakly;

// Placeholder integration test verifying Spring application context loading with Testcontainers and PostgreSQL.
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class BreaklyBeApplicationTests {

	@Test
	void contextLoads() {
	}

}
