package co.movielearn.user;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static co.movielearn.user.UserMapper.toUserDto;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public UserDto createUserFromOAuth2(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("given_name");
        String lastname = oauth2User.getAttribute("family_name");
        String profilePictureUrl = oauth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUser(email, name, lastname, profilePictureUrl));

        return toUserDto(userRepository.save(user));
    }

    public void changeEnglishLevel(OAuth2User oauth2User, EnglishLevel level) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));
        user.setEnglishLevel(level);
        userRepository.save(user);
    }

    public UserDto updateUser(@AuthenticationPrincipal OAuth2User oauth2User, UserDto userDto) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));

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

    private User createUser(String email, String name, String lastname, String profilePictureUrl) {
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
    }

    public void saveAvatar(MultipartFile file, OAuth2User oauth2User) throws IOException {
        String email = oauth2User.getAttribute("email");

        if (email == null) {
            throw new IllegalArgumentException("Email not found in OAuth2User attributes");
        }

        // Перевірка типу файлу
        String fileType = file.getContentType();
        if (fileType == null || !fileType.startsWith("image/")) {
            throw new IllegalArgumentException("Uploaded file must be an image");
        }

        // Перевірка розміру файлу (не більше 5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds the limit of 5MB");
        }

        // Читання байтів файлу
        byte[] avatarBytes = file.getBytes();

        // Оновлення аватара в базі даних
        User user = getCurrentUserByEmail(email);
        user.setProfilePic(avatarBytes);
        userRepository.save(user);
    }

}
