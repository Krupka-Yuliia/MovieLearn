package co.movielearn.security;

import co.movielearn.user.UserDto;
import co.movielearn.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        UserDto userDto = userService.createUserFromOAuth2(oauth2User);

        if (userDto.getEnglishLevel() != null ) {
            response.sendRedirect("http://localhost:5173/account");
        } else {
            response.sendRedirect("http://localhost:5173/level");
        }
    }
}