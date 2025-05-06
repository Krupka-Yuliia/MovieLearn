package co.movielearn.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
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

    @PutMapping("/level/{level}")
    public void updateEnglishLevel(
            @AuthenticationPrincipal OAuth2User oauth2User,
            @PathVariable EnglishLevel level) {
        userService.changeEnglishLevel(oauth2User, level);
    }

    @GetMapping("/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@AuthenticationPrincipal OAuth2User oauth2User) {
        UserDto userDto = userService.getCurrentUser(oauth2User);

        if (userDto.getProfilePic() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header("Cache-Control", "no-store")
                .body(userDto.getProfilePic());
    }

    @PutMapping("/profile-picture/upload")
    public ResponseEntity<String> uploadProfilePicture(
            @AuthenticationPrincipal OAuth2User oauth2User,
            @RequestPart("file") MultipartFile file) throws IOException {
        userService.saveAvatar(file, oauth2User);
        return ResponseEntity.ok("Profile picture uploaded successfully");
    }


    @PutMapping("/interests")
    public ResponseEntity<String> saveInterests(@AuthenticationPrincipal OAuth2User oauth2User,
                                                @RequestBody List<String> interestNames) {
        try {
            userService.saveOrUpdateInterests(oauth2User, interestNames);
            return ResponseEntity.ok("Interests saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save interests: " + e.getMessage());
        }
    }



}