package co.movielearn.movie;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private MovieMapper movieMapper;
    @Autowired
    private GenreRepository genreRepository;

    public List<MovieDto> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(movieMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<MovieDto> getMoviesByUserId(Long userId) {
        List<Movie> movies = movieRepository.findMoviesByUsers_Id(userId);
        return movies.stream()
                .map(movieMapper::toDTO)
                .collect(Collectors.toList());
    }

    public MovieDto getMovieById(Long id) {
        Optional<Movie> movie = movieRepository.findById(id);
        return movie.map(movieMapper::toDTO)
                .orElse(null);
    }

    public MovieDto addMovie(MovieDto movieDto) {
        Movie movie = new Movie();

        movie.setTitle(movieDto.getTitle());
        movie.setDescription(movieDto.getDescription());

        for (String genreName : movieDto.getGenres()) {
            Genre genre = genreRepository.findByName(genreName);
            if (genre != null) {
                movie.getGenres().add(genre);
            }
        }

        movie.setImage(movieDto.getImage() != null ? movieDto.getImage() : null);
        movie = movieRepository.save(movie);
        return movieMapper.toDTO(movie);
    }

    public void addMovieImage(MultipartFile file, Long movieId) {
        Optional<Movie> movie = movieRepository.findById(movieId);
        if (movie.isPresent()) {
            try {
                byte[] imageBytes = file.getBytes();
                Movie existingMovie = movie.get();
                existingMovie.setImage(imageBytes);
                movieRepository.save(existingMovie);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        } else {
            throw new RuntimeException("Movie not found with ID: " + movieId);
        }
    }


}
