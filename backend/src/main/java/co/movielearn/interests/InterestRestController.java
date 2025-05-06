package co.movielearn.interests;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/interests")
public class InterestRestController {
    private final InterestService interestService;

    @GetMapping
    public List<Interest> getAllInterests() {
        return interestService.getAllInterests();
    }

    @PostMapping
    public Interest addInterest(@RequestBody Interest interest) {
        return interestService.addInterest(interest);
    }

    @DeleteMapping("/{id}")
    public void deleteGenre(@PathVariable Long id) {
        interestService.deleteInterestById(id);
    }

    @PutMapping("/{id}")
    public void updateinterest(@PathVariable Long id, @RequestBody Interest interest) {
        interestService.updateInterest(id, interest);
    }

    @GetMapping("/{id}")
    public Interest getinterestById(@PathVariable Long id) {
        return interestService.getInterestById(id);
    }


}
