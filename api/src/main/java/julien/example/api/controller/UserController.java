package julien.example.api.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import julien.example.api.message.ErrorMessages;
import julien.example.api.message.SuccessMessages;
import julien.example.api.model.User;
import julien.example.api.payload.request.UpdateUserRequest;
import julien.example.api.payload.response.MessageResponse;
import julien.example.api.repository.UserRepository;
import julien.example.api.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('MODERATOR')")
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/board")
    public String userAccess() { return "User Board."; }

    @PatchMapping("/data")
    public ResponseEntity<?> updateUserData(@Valid @RequestBody UpdateUserRequest updateUserRequest, HttpServletRequest request) {
        String token = jwtUtils.getJwtFromCookies(request);
        String username = jwtUtils.getUserNameFromJwtToken(token);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorMessages.getErrorMessage("error.code.100")));
        if (!userRepository.existsByEmailAndUsernameNot(updateUserRequest.getEmail(), username)) {
            user.setEmail(updateUserRequest.getEmail());
        } else {
            return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.101")), HttpStatus.BAD_REQUEST);
        }
        user.setPassword(encoder.encode(updateUserRequest.getPassword()));
        userRepository.save(user);

        return new ResponseEntity<>(new MessageResponse(SuccessMessages.getSuccessMessage("success.code.200")), HttpStatus.OK);
    }
}
