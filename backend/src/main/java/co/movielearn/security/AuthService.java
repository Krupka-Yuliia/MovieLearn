package co.movielearn.security;

import co.movielearn.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final UserRepository userRepository;

    public String getUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return "GUEST";
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomOAuth2User)) {
            return "GUEST";
        }

        CustomOAuth2User currentUser = (CustomOAuth2User) principal;
        String userEmail = currentUser.getAttribute("email");

        return userRepository.findByEmail(userEmail)
                .map(user -> user.getRole().name())
                .orElse("GUEST");
    }
}
