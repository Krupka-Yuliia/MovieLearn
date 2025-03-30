package co.movielearn.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import static co.movielearn.user.UserMapper.toUserDto;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;


    @Transactional
    public UserDto updateOrCreateUserFromOAuth2(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("given_name");
        String lastname = oauth2User.getAttribute("family_name");
        String profilePictureUrl = oauth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.setName(name);
                    existingUser.setLastName(lastname);
                    if (profilePictureUrl != null) {
                        byte[] pictureBytes = downloadProfilePicture(profilePictureUrl);
                        existingUser.setProfilePic(pictureBytes);
                    }
                    return existingUser;
                })
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
        User user = userRepository.findByEmail(oauth2User.getAttribute("email"))
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnglishLevel(level);
        userRepository.save(user);
    }


    public void delete(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("User with id %s not found".formatted(id))
        );
        userRepository.delete(user);
    }

    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("User with id %s not found".formatted(id))
        );

        user.setName(userDto.getName());
        user.setLastName(userDto.getLastName());
        user.setEnglishLevel(userDto.getEnglishLevel());
        user.setProfilePic(userDto.getProfilePic());
        return toUserDto(userRepository.save(user));
    }

    public UserDto getCurrentUser(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        if (email == null) {
            throw new RuntimeException("Email not found in OAuth2User attributes");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return toUserDto(user);
    }


    private byte[] downloadProfilePicture(String profilePictureUrl) {
        return restTemplate.getForObject(profilePictureUrl, byte[].class);
    }
}
