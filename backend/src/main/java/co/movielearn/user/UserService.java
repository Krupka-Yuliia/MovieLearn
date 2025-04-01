package co.movielearn.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import static co.movielearn.user.UserMapper.toUserDto;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public UserDto updateOrCreateUserFromOAuth2(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("given_name");
        String lastname = oauth2User.getAttribute("family_name");
        String profilePictureUrl = oauth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setLastName(lastname);
                    newUser.setRole(Role.USER);
                    newUser.setEnglishLevel(null);

                    if (profilePictureUrl != null) {
                        byte[] pictureBytes = downloadProfilePicture(profilePictureUrl);
                        newUser.setProfilePic(pictureBytes);
                    }
                    return newUser;
                });

        return toUserDto(userRepository.save(user));
    }


    public void changeEnglishLevel(OAuth2User oauth2User, EnglishLevel level) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));
        user.setEnglishLevel(level);
        userRepository.save(user);
    }

    public UserDto updateUser(@AuthenticationPrincipal OAuth2User principal, UserDto userDto) {
        User user = getCurrentUserByEmail(principal.getAttribute("email"));

        if (userDto.getName() != null && !userDto.getName().isEmpty()) {
            user.setName(userDto.getName());
        }
        if (userDto.getLastName() != null && !userDto.getLastName().isEmpty()) {
            user.setLastName(userDto.getLastName());
        }
        if (userDto.getEnglishLevel() != null) {
            user.setEnglishLevel(userDto.getEnglishLevel());
        }

        return toUserDto(userRepository.save(user));
    }

    public UserDto getCurrentUser(OAuth2User oauth2User) {
        return toUserDto(getCurrentUserByEmail(oauth2User.getAttribute("email")));
    }

    private User getCurrentUserByEmail(String email) {
        if (email == null) {
            throw new RuntimeException("Email not found in OAuth2User attributes");
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    private byte[] downloadProfilePicture(String profilePictureUrl) {
        return restTemplate.getForObject(profilePictureUrl, byte[].class);
    }
}
