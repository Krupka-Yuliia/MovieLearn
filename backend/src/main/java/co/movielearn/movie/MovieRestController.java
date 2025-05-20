package co.movielearn.movie;

import co.movielearn.user.UserDto;
import co.movielearn.user.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

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

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(
            @PathVariable Long id,
            @RequestBody MovieDto movieDto
    ) {
        MovieDto updatedMovie = movieService.updateMovie(id, movieDto);
        return ResponseEntity.ok(updatedMovie);
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MovieDto> updateMovieImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image
    ) {
        MovieDto updatedMovie = movieService.updateMovieImage(id, image);
        return ResponseEntity.ok(updatedMovie);
    }

    @PostMapping(value = "/{id}/script", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MovieDto> updateMovieScript(
            @PathVariable Long id,
            @RequestParam("script") MultipartFile script
    ) {
        MovieDto updatedMovie = movieService.updateMovieScript(id, script);
        return ResponseEntity.ok(updatedMovie);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getMovieImage(@PathVariable Long id) {
        MovieDto movie = movieService.getMovieById(id);
        byte[] imageData = movie.getImage();
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(imageData);
    }

    @GetMapping("/{id}/script")
    public ResponseEntity<byte[]> getMovieScript(@PathVariable Long id) {
        MovieDto movie = movieService.getMovieById(id);
        byte[] scriptData = movie.getScript();
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(scriptData);
    }


    @GetMapping("/search")
    public ResponseEntity<List<MovieDto>> searchMoviesByTitle(
            @RequestParam String title) {

        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(movieService.getMoviesByTitle(title));

    }
}
