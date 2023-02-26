package julien.example.api.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import julien.example.api.message.ErrorMessages;
import julien.example.api.message.SuccessMessages;
import julien.example.api.model.ERole;
import julien.example.api.model.Role;
import julien.example.api.model.User;
import julien.example.api.payload.request.LoginRequest;
import julien.example.api.payload.request.SignupRequest;
import julien.example.api.payload.response.MessageResponse;
import julien.example.api.payload.response.UserInfoResponse;
import julien.example.api.repository.RoleRepository;
import julien.example.api.repository.UserRepository;
import julien.example.api.security.jwt.JwtUtils;
import julien.example.api.security.services.UserDetailsImpl;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://ulaval.julienfuix.com", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Value("${julien.app.jwtSecret}")
    private String jwtSecret;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private HttpServletRequest request;

    @PostMapping("/autologin")
    public ResponseEntity<?> autoLogin() {
        String cookie = jwtUtils.getJwtFromCookies(request);
        System.out.println(cookie);

        if (cookie != null) {
            System.out.print("Le token n'est pas vide\n");
            String tokenIsValid = jwtUtils.isTokenExpired(jwtUtils.getJwtFromCookies(request));

            if (Objects.equals(tokenIsValid, "valid")) {
                System.out.print("Le token est encore valide\n");
                String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.getJwtFromCookies(request));
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException(ErrorMessages.getErrorMessage("error.code.100")));

                Set<Role> userRoles = user.getRoles();
                List<String> rolesString = new ArrayList<>();

                for (Role items : userRoles) {
                    if (items == roleRepository.findByName(ERole.ROLE_MODERATOR).orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")))) {
                        rolesString.add("ROLE_MODERATOR");
                    } else if (items == roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")))) {
                        rolesString.add("ROLE_ADMIN");
                    } else {
                        rolesString.add("ROLE_USER");
                    }
                }

                return ResponseEntity.ok().body(new UserInfoResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getUserRight(),
                        rolesString));
            } else if (Objects.equals(tokenIsValid, "expired")) {
                System.out.print("Le token est expiré\n");
                java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
                String[] parts = jwtUtils.getJwtFromCookies(request).split("\\.");
                String payloadJson = new String(decoder.decode(parts[1]));
                JSONParser parser = new JSONParser();
                try {
                    JSONObject json = (JSONObject) parser.parse(payloadJson);
                    String username = (String) json.get("sub");

                    ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(username);

                    User user = userRepository.findByUsername(username)
                            .orElseThrow(() -> new UsernameNotFoundException(ErrorMessages.getErrorMessage("error.code.100")));

                    Set<Role> userRoles = user.getRoles();
                    List<String> rolesString = new ArrayList<>();

                    for (Role items : userRoles) {
                        if (items == roleRepository.findByName(ERole.ROLE_MODERATOR).orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")))) {
                            rolesString.add("ROLE_MODERATOR");
                        } else if (items == roleRepository.findByName(ERole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")))) {
                            rolesString.add("ROLE_ADMIN");
                        } else {
                            rolesString.add("ROLE_USER");
                        }
                    }

                    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                            .body(new UserInfoResponse(user.getId(),
                                    user.getUsername(),
                                    user.getEmail(),
                                    user.getUserRight(),
                                    rolesString));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return new ResponseEntity<>(new MessageResponse("Expired"), HttpStatus.UNAUTHORIZED);
                // return new ResponseEntity<>("expired", HttpStatus.UNAUTHORIZED);
            } else {
                System.out.print("Le token est pas bon\n");
                return new ResponseEntity<>(new MessageResponse("Le token est pas bon"), HttpStatus.UNAUTHORIZED);
                // return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.103")), HttpStatus.UNAUTHORIZED);
            }
        } else {
            System.out.print("Le cookie est null ou vide\n");
            return new ResponseEntity<>(new MessageResponse("Le cookie est null ou vide"), HttpStatus.UNAUTHORIZED);
            // return new ResponseEntity<>(new MessageResponse(ErrorMessages.getErrorMessage("error.code.103")), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        System.out.print("Token dans le header: ");
        System.out.print(jwtCookie.toString());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(new UserInfoResponse(userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        userDetails.getUserRight(),
                        roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse(ErrorMessages.getErrorMessage("error.code.102")));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse(ErrorMessages.getErrorMessage("error.code.101")));
        }

        User user = new User(signupRequest.getUsername(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()),
                "ROLE_USER");

        Set<String> strRoles = signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin" -> {
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")));
                        roles.add(adminRole);
                    }
                    case "mod" -> {
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")));
                        roles.add(modRole);
                    }
                    default -> {
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException(ErrorMessages.getErrorMessage("error.code.104")));
                        roles.add(userRole);
                    }
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse(SuccessMessages.getSuccessMessage("success.code.201")));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse(SuccessMessages.getSuccessMessage("success.code.202")));
    }
}
