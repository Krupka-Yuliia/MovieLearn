package co.movielearn.movie;

import co.movielearn.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovieDto {
    private Long id;
    private String title;
    private String description;
    private List<String> genres;
    private List<User> users;
    private byte[] image;
}
