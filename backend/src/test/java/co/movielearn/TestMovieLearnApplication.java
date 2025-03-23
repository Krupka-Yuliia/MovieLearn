package co.movielearn;

import org.springframework.boot.SpringApplication;

public class TestMovieLearnApplication {

    public static void main(String[] args) {
        SpringApplication.from(MovieLearnApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
