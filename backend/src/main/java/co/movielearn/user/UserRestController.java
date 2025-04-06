package co.movielearn.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://localhost:5173"},
        allowedHeaders = {"Authorization", "Content-Type", "X-Requested-With"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.OPTIONS},
        allowCredentials = "true")
public class UserRestController {

    private final UserService userService;

    @GetMapping("/account")
    public UserDto getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        return userService.getCurrentUser(oauth2User);
    }

    @PutMapping("/account/update")
    public UserDto updateUser(@AuthenticationPrincipal OAuth2User oauth2User, @RequestBody UserDto userDto) {
        return userService.updateUser(oauth2User, userDto);
    }

    @PostMapping
    public UserDto createUser(@AuthenticationPrincipal OAuth2User oauth2User) {
        return userService.createUserFromOAuth2(oauth2User);
    }

    @PutMapping("/level/{level}")
    public void updateEnglishLevel(
            @AuthenticationPrincipal OAuth2User oauth2User,
            @PathVariable EnglishLevel level) {
        userService.changeEnglishLevel(oauth2User, level);
    }

    @GetMapping("/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@AuthenticationPrincipal OAuth2User principal) {
        UserDto userDto = userService.getCurrentUser(principal);

        if (userDto.getProfilePic() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(userDto.getProfilePic());
    }

    @PostMapping("/profile-picture/upload")
    public ResponseEntity<String> uploadProfilePicture(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestPart("file") MultipartFile file) {
        try {
            userService.saveAvatar(file, principal);
            return ResponseEntity.ok("Profile picture uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload profile picture: " + e.getMessage());
        }
    }
}