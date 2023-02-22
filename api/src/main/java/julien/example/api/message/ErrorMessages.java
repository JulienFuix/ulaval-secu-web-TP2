package julien.example.api.message;

import java.io.IOException;
import java.util.Properties;

public class ErrorMessages {
    private static final Properties errorMessages;

    static {
        errorMessages = new Properties();
        try {
            errorMessages.load(ErrorMessages.class.getClassLoader().getResourceAsStream("error_messages.properties"));
        } catch (IOException e) {
            System.err.print("Error occurred while loading error file");
        }
    }

    public static String getErrorMessage(String errorCode) {
        return errorMessages.getProperty(errorCode);
    }
}
