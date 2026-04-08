package com.handloom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HandloomApplication {
    public static void main(String[] args) {
        SpringApplication.run(HandloomApplication.class, args);
    }
}
