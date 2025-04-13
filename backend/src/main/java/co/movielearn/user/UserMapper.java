package co.movielearn.user;

public class UserMapper {

    public static UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }

        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getLastName(),
                user.getEnglishLevel(),
                user.getProfilePic(),
                user.getRole(),
                user.getInterests()
        );
    }
}
