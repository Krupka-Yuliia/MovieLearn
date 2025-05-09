package co.movielearn.movie;

import co.movielearn.genre.Genre;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MovieMapper {

    public MovieDto toDTO(Movie movie) {
        MovieDto movieDto = new MovieDto();
        movieDto.setId(movie.getId());
        movieDto.setTitle(movie.getTitle());
        movieDto.setDescription(movie.getDescription());
        movieDto.setGenres(movie.getGenres().stream()
                .map(Genre::getName)
                .collect(Collectors.toList()));
        movieDto.setImage(movie.getImage());
        movieDto.setScript(movie.getScript());
        return movieDto;
    }

    public Movie toEntity(MovieDto movieDto) {
        Movie movie = new Movie();
        movie.setId(movieDto.getId());
        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());
        movie.setImage(movieDto.getImage());
        movie.setScript(movieDto.getScript());
        return movie;
    }
}
