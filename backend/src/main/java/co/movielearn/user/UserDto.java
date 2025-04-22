package co.movielearn.user;

import co.movielearn.movie.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String lastName;
    private EnglishLevel englishLevel;
    private byte[] profilePic;
    private Role role;
    private List<Interest> interests = new ArrayList<>();
    private List<Movie> movies = new ArrayList<>();
}
