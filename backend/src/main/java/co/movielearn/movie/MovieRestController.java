package co.movielearn.movie;

import co.movielearn.user.UserDto;
import co.movielearn.user.UserService;
import lombok.AllArgsConstructor;
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
        UserDto userDto = userService.getCurrentUser(principal.getAttribute("email"));
        return movieService.getMoviesByUserId(userDto.getId());
    }

    @PostMapping("/new")
    public MovieDto createMovie(@RequestBody MovieDto movieDto) {
        return movieService.addMovie(movieDto);
    }

    @PutMapping("/uploadImage")
    public void uploadImage(@RequestParam("file") MultipartFile file, Long movieId) {
        movieService.addMovieImage(file, movieId);
    }
}
