import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CheckHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Matches? " + encoder.matches("Divaes176@", "$2a$10$lxqY0h34N33K9hsJ.LiPdemefoW5eHzmiALP2pvm9XU8HcJUkxzvq"));
    }
}
