package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@EntityScan(basePackages = {"org.example"})
// Replace with your package name
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

}
