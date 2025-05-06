package co.movielearn.genre;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/genres")
public class GenreRestController {
    private final GenreService genreService;

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreService.getAllGenres();
    }

    @DeleteMapping("/{id}")
    public void deleteGenre(@PathVariable Long id) {
        genreService.deleteGenreById(id);
    }

    @PutMapping("/{id}")
    public void updateGenre(@PathVariable Long id, @RequestBody Genre genre) {
        genreService.updateGenre(id, genre);
    }

    @PostMapping
    public void addGenre(@RequestBody Genre genre) {
        genreService.saveGenre(genre);
    }

    @GetMapping("/{id}")
    public Genre getGenreById(@PathVariable Long id) {
        return genreService.getGenreById(id);
    }
}
