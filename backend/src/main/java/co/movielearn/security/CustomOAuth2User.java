package co.movielearn.security;

import co.movielearn.user.Role;
import co.movielearn.user.User;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collections;

@Getter
public class CustomOAuth2User extends DefaultOAuth2User {

    private final Role role;
    private final User user;

    public CustomOAuth2User(OAuth2User oAuth2User, User user) {
        super(
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                oAuth2User.getAttributes(),
                "email"
        );
        this.role = user.getRole();
        this.user = user;
    }
}
