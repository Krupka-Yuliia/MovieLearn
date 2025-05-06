package co.movielearn.interests;

import co.movielearn.genre.Genre;
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

    public Interest addInterest(Interest interest) {
        return interestRepository.save(interest);
    }

    public void deleteInterestById(Long id) {
        interestRepository.deleteById(id);
    }

    public Interest updateInterest(Long id, Interest interest) {
        Interest oldInterest = getInterestById(id);
        oldInterest.setName(interest.getName());
        return interestRepository.save(oldInterest);
    }

    public Interest getInterestById(Long id) {
        return interestRepository.findById(id).orElse(null);
    }
}
