package co.movielearn.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/users")
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

//    @PostMapping
//    public UserDto createUser(@AuthenticationPrincipal OAuth2User principal) {
//        return userService.updateOrCreateUserFromOAuth2(principal);
//    }

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

}