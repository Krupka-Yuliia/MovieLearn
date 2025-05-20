package co.movielearn.movie;

import co.movielearn.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findMoviesByUsers_Id(Long userId);

    int countMoviesByUsers_Id(Long userId);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE LOWER(g.name) = LOWER(:genreName)")
    List<Movie> findByGenreIgnoreCase(@Param("genreName") String genreName);

    List<Movie> findByTitleContainingIgnoreCase(String title);

}
