package co.movielearn.user;

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
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static co.movielearn.user.UserMapper.toUserDto;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final InterestRepository interestRepository;

    public UserDto createUserFromOAuth2(OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("given_name");
        String lastname = oauth2User.getAttribute("family_name");
        String profilePictureUrl = oauth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUser(email, name, lastname, profilePictureUrl));

        return toUserDto(userRepository.save(user));
    }

    public void saveAvatar(MultipartFile file, OAuth2User oauth2User) throws IOException {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));
        validateFile(file);
        byte[] avatarBytes = file.getBytes();
        user.setProfilePic(avatarBytes);
        userRepository.save(user);
    }

    public UserDto getCurrentUser(OAuth2User oauth2User) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));
        return toUserDto(user);
    }

    public UserDto updateUser(OAuth2User oauth2User, UserDto userDto) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));

        if (userDto.getName() != null) user.setName(userDto.getName());
        if (userDto.getLastName() != null) user.setLastName(userDto.getLastName());
        if (userDto.getEnglishLevel() != null) user.setEnglishLevel(userDto.getEnglishLevel());

        if (userDto.getInterests() != null && !userDto.getInterests().isEmpty()) {
            List<Interest> interests = userDto.getInterests().stream()
                    .map(interestFromDto -> interestRepository.findByName(interestFromDto.getName())
                            .orElseThrow(() -> new RuntimeException("Interest not found: " + interestFromDto.getName())))
                    .collect(Collectors.toList());
            user.setInterests(interests);
        }
        return toUserDto(userRepository.save(user));
    }

    public void saveOrUpdateInterests(@AuthenticationPrincipal OAuth2User oauth2User, List<String> interestNames) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));

        List<Interest> interests = new ArrayList<>();
        for (String interestName : interestNames) {
            interestName = interestName.trim();
            if (!interestName.isEmpty()) {
                Optional<Interest> interest = interestRepository.findByName(interestName);
                interests.add(interest.get());
            }
        }
        user.setInterests(interests);
        userRepository.save(user);
    }



    public void changeEnglishLevel(OAuth2User oauth2User, EnglishLevel level) {
        User user = getCurrentUserByEmail(oauth2User.getAttribute("email"));
        user.setEnglishLevel(level);
        userRepository.save(user);
    }

    private void validateFile(MultipartFile file) {
        String fileType = file.getContentType();
        if (fileType == null || !fileType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Uploaded file must be an image");
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "File size exceeds the limit of 5MB");
        }
    }

    private User createUser(String email, String name, String lastname, String profilePictureUrl) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setLastName(lastname);
        newUser.setRole(Role.USER);

        if (profilePictureUrl != null) {
            byte[] pictureBytes = downloadProfilePicture(profilePictureUrl);
            newUser.setProfilePic(pictureBytes);
        }
        return newUser;
    }

    private byte[] downloadProfilePicture(String profilePictureUrl) {
        try {
            return restTemplate.getForObject(profilePictureUrl, byte[].class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to download profile picture", e);
        }
    }

    private User getCurrentUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with email: " + email));
    }


}
