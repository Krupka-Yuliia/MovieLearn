package co.movielearn.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    private String lastName;
    private String email;
    private String password;
    private byte[] profilePic;

    @Enumerated(EnumType.STRING)
    private EnglishLevel englishLevel;

    @Enumerated(EnumType.STRING)
    private Role role;
}
