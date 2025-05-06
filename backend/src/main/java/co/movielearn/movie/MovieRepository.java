package co.movielearn.movie;

import co.movielearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findMoviesByUsers_Id(Long userId);

    int countMoviesByUsers_Id(Long userId);
    List<Movie> findByGenreIgnoreCase(String genre);


}
