package co.movielearn.movie;

import co.movielearn.genre.Genre;
import co.movielearn.genre.GenreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;
    private final GenreRepository genreRepository;

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

    public List<MovieDto> getMoviesByGenre(String genre) {
        return movieRepository.findByGenreIgnoreCase(genre)
                .stream()
                .map(movieMapper::toDTO)
                .collect(Collectors.toList());
    }


    public MovieDto createMovie(String title, String description, String genres, MultipartFile image, MultipartFile script) {
        Movie movie = new Movie();
        movie.setTitle(title);
        movie.setDescription(description);

        List<Genre> genreList = new ArrayList<>();
        for (String genreName : genres.split(",")) {
            Genre genre = genreRepository.findByName(genreName.trim());
            if (genre != null) {
                genreList.add(genre);
            }
        }
        movie.setGenres(genreList);
        movie = movieRepository.save(movie);

        if (image != null && !image.isEmpty()) {
            saveImage(image, movie);
        }

        if (script != null && !script.isEmpty()) {
            saveScript(script, movie);
        }

        return movieMapper.toDTO(movie);
    }

    public MovieDto updateMovie(Long movieId, MovieDto movieDto) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with id: " + movieId));

        if (movieDto.getTitle() != null && !movieDto.getTitle().isBlank()) {
            movie.setTitle(movieDto.getTitle());
        }

        if (movieDto.getDescription() != null && !movieDto.getDescription().isBlank()) {
            movie.setDescription(movieDto.getDescription());
        }

        if (movieDto.getGenres() != null && !movieDto.getGenres().isEmpty()) {
            List<Genre> genreList = new ArrayList<>();
            for (String genreName : movieDto.getGenres()) {
                Genre genre = genreRepository.findByName(genreName.trim());
                if (genre != null) {
                    genreList.add(genre);
                }
            }
            movie.setGenres(genreList);
        }

        movie = movieRepository.save(movie);
        return movieMapper.toDTO(movie);
    }

    public MovieDto updateMovieImage(Long movieId, MultipartFile image) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with id: " + movieId));

        if (image != null && !image.isEmpty()) {
            saveImage(image, movie);
        }

        return movieMapper.toDTO(movie);
    }

    public MovieDto updateMovieScript(Long movieId, MultipartFile script) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new EntityNotFoundException("Movie not found with id: " + movieId));

        if (script != null && !script.isEmpty()) {
            saveScript(script, movie);
        }

        return movieMapper.toDTO(movie);
    }


    public int getMoviesCountByUserId(Long userId) {
        return movieRepository.countMoviesByUsers_Id(userId);
    }

    private void saveImage(MultipartFile file, Movie movie) {
        try {
            byte[] imageBytes = file.getBytes();
            movie.setImage(imageBytes);
            movieRepository.save(movie);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    private void saveScript(MultipartFile file, Movie movie) {
        try {
            byte[] scriptBytes = file.getBytes();
            movie.setScript(scriptBytes);
            movieRepository.save(movie);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload script", e);
        }
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    public List<MovieDto> getMoviesByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Search title cannot be empty");
        }

        return movieRepository.findByTitleContainingIgnoreCase(title.trim())
                .stream()
                .map(movieMapper::toDTO)
                .collect(Collectors.toList());
    }
}
