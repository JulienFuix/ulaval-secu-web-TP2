package julien.example.api.controller;

import jakarta.validation.Valid;
import julien.example.api.message.ErrorMessages;
import julien.example.api.message.SuccessMessages;
import julien.example.api.model.ERole;
import julien.example.api.model.Role;
import julien.example.api.model.User;
import julien.example.api.payload.request.SignupRequest;
import julien.example.api.payload.response.MessageResponse;
import julien.example.api.repository.RoleRepository;
import julien.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:8081", maxAge = 3600, allowCredentials = "true")
@RestController
@PreAuthorize("hasRole('MODERATOR')")
@RequestMapping("/api/moderator")
public class ModoController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/board")
    public String modoAccess() {
        return "Moderator Board.";
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAllByRolesId(1);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> users = userRepository.findAllByRolesId(3);
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
                if (role.getName() == ERole.ROLE_USER || role.getName() == ERole.ROLE_ADMIN) {
                    return new ResponseEntity<>(user, HttpStatus.OK);
                }
            }
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.103")), HttpStatus.UNAUTHORIZED);
        }
    }

    @PatchMapping("/user/{id}")
    public ResponseEntity<?> updateUserData(@Valid @RequestBody SignupRequest signupRequest, @PathVariable Integer id) {
        if (signupRequest.getRole() == null) {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.104")), HttpStatus.BAD_REQUEST);
        }
        Set<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        for (String role : strRoles) {
            if (!Objects.equals(role, "user") && !Objects.equals(role, "admin")) {
                return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.103")), HttpStatus.UNAUTHORIZED);
            } else {
                if (Objects.equals(role, "user")) {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")));
                    roles.add(userRole);
                }
                if (Objects.equals(role, "admin")) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")));
                    roles.add(adminRole);
                }
            }
        }

        User user = userRepository.findById(id);
        if (user == null) {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.100")), HttpStatus.BAD_REQUEST);
        }
        if (!userRepository.existsByEmailAndUsernameNot(signupRequest.getEmail(), signupRequest.getUsername())) {
            user.setEmail(signupRequest.getEmail());
        } else {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.101")), HttpStatus.BAD_REQUEST);
        }
        user.setRoles(roles);
        user.setPassword(encoder.encode(signupRequest.getPassword()));
        userRepository.save(user);

        return new ResponseEntity<>(new MessageResponse(SuccessMessages.getSuccessMessage("success.code.200")), HttpStatus.OK);
    }
}
