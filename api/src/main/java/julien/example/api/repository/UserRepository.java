package julien.example.api.repository;

import julien.example.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    User findById(Integer id);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Boolean existsByEmailAndUsernameNot(String email, String username);

    List<User> findAllByRolesId(Integer Id);
}
