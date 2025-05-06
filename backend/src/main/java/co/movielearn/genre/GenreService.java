package co.movielearn.genre;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class GenreService {
    private final GenreRepository genreRepository;

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public Genre getGenreById(Long id) {
        return genreRepository.findById(id).orElse(null);
    }

    public Genre saveGenre(Genre genre) {
        return genreRepository.save(genre);
    }

    public void deleteGenreById(Long id) {
        genreRepository.deleteById(id);
    }

    public Genre updateGenre(Long id, Genre genre) {
        Genre oldGenre = getGenreById(id);
        oldGenre.setName(genre.getName());
        return genreRepository.save(oldGenre);
    }

}
