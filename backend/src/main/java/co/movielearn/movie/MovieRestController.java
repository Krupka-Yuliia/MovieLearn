package co.movielearn.movie;

import co.movielearn.user.UserDto;
import co.movielearn.user.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/movies")
public class MovieRestController {
    private final MovieService movieService;
    private final UserService userService;

    @GetMapping
    public List<MovieDto> getMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public MovieDto getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @GetMapping("/home")
    public List<MovieDto> getMoviesByUserId(@AuthenticationPrincipal OAuth2User principal) {
        UserDto userDto = userService.getCurrentUser(principal);
        return movieService.getMoviesByUserId(userDto.getId());
    }

    @PostMapping
    public ResponseEntity<MovieDto> createMovie(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("genres") String genres,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "script", required = false) MultipartFile script) {

        try {
            MovieDto movieDto = movieService.createMovie(title, description, genres, image, script);
            return new ResponseEntity<>(movieDto, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/count")
    public int getMoviesCount(@AuthenticationPrincipal OAuth2User principal) {
        UserDto userDto = userService.getCurrentUser(principal);
        return movieService.getMoviesCountByUserId(userDto.getId());
    }

    @DeleteMapping("/{id}")
    public void deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
    }

    @GetMapping("/movies")
    public List<MovieDto> getMovies(@RequestParam String genre) {
        if (genre == null || genre.equalsIgnoreCase("all")) {
            return movieService.getAllMovies();
        } else {
            return movieService.getMoviesByGenre(genre);
        }
    }


}
