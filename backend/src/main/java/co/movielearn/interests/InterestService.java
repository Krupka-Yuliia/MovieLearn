package co.movielearn.interests;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Service
public class InterestService {

    @Autowired
    private InterestRepository interestRepository;

    public List<Interest> getAllInterests() {
        return interestRepository.findAll();
    }
}
