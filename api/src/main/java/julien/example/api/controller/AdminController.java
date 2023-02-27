package julien.example.api.controller;

import julien.example.api.message.ErrorMessages;
import julien.example.api.message.SuccessMessages;
import julien.example.api.model.ERole;
import julien.example.api.model.Role;
import julien.example.api.model.User;
import julien.example.api.payload.response.MessageResponse;
import julien.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@CrossOrigin(origins = "https://ulaval.julienfuix.com", maxAge = 3600, allowCredentials = "true")
@RestController
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/board")
    public String adminAccess() {
        return "Admin Board.";
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAllByRolesId(1);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserData(@PathVariable Integer id) {
        User user = userRepository.findById(id);
        if (user == null) {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.100")), HttpStatus.BAD_REQUEST);
        } else {
            Set<Role> roles = user.getRoles();
            for (Role role : roles) {
                if (role.getName() == ERole.ROLE_USER) {
                    return new ResponseEntity<>(user, HttpStatus.OK);
                }
            }
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.103")), HttpStatus.UNAUTHORIZED);
        }
    }

    @PatchMapping("/user/setemail/{id}")
    public ResponseEntity<?> updateUserEmail(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        /*if (signupRequest.getRole() == null) {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.104")), HttpStatus.BAD_REQUEST);
        }
        Set<String> strRoles = signupRequest.getRole();

        for (String role : strRoles) {
            if (!Objects.equals(role, "user")) {
                return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.103")), HttpStatus.UNAUTHORIZED);
            }
        }*/
        String email = request.get("email");

        User user = userRepository.findById(id);
        if (user == null) {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.100")), HttpStatus.BAD_REQUEST);
        }
        if (!userRepository.existsByEmail(email)) {
            user.setEmail(email);
        } else {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.101")), HttpStatus.BAD_REQUEST);
        }
        userRepository.save(user);

        return new ResponseEntity<>(new MessageResponse(SuccessMessages.getSuccessMessage("success.code.200")), HttpStatus.OK);
    }

    @PatchMapping("/user/setpassword/{id}")
    public ResponseEntity<?> updateUserPassword(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        User user = userRepository.findById(id);
        if (user == null) {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.100")), HttpStatus.BAD_REQUEST);
        }

        String password = request.get("password");
        String passwordVerif = request.get("passwordVerif");
        if (Objects.equals(password, passwordVerif)) {
            user.setPassword(encoder.encode(password));
            userRepository.save(user);
            return new ResponseEntity<>(new MessageResponse(SuccessMessages.getSuccessMessage("success.code.200")), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.105")), HttpStatus.BAD_REQUEST);
        }
    }
}
