package julien.example.api.init;

import jakarta.annotation.PostConstruct;
import julien.example.api.model.ERole;
import julien.example.api.model.Role;
import julien.example.api.model.User;
import julien.example.api.repository.RoleRepository;
import julien.example.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class UserInitializer {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Value("${julien.app.modoUsername}")
    private String modoUsername;

    @Value("${julien.app.modoEmail}")
    private String modoEmail;

    @Value("${julien.app.modoPassword}")
    private String modoPassword;

    @Value("${julien.app.adminUsername}")
    private String adminUsername;

    @Value("${julien.app.adminEmail}")
    private String adminEmail;

    @Value("${julien.app.adminPassword}")
    private String adminPassword;

    @PostConstruct
    public void initModo() {
        if (userRepository.findByUsername(modoUsername).isEmpty()) {
            User usermodo = new User(modoUsername, modoEmail, encoder.encode(modoPassword));
            Set<Role> rolesModo = new HashSet<>();
            Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            rolesModo.add(modRole);

            usermodo.setRoles(rolesModo);
            userRepository.save(usermodo);
        }
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User useradmin = new User(adminUsername, adminEmail, encoder.encode(adminPassword));
            Set<Role> rolesAdmin = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            rolesAdmin.add(adminRole);

            useradmin.setRoles(rolesAdmin);
            userRepository.save(useradmin);
        }
    }
}
