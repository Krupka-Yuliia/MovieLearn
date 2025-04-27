package co.movielearn.interests;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


}
