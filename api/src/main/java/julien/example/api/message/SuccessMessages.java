package julien.example.api.message;

import java.io.IOException;
import java.util.Properties;

public class SuccessMessages {
    private static final Properties successMessages;

    static {
        successMessages = new Properties();
        try {
            successMessages.load(SuccessMessages.class.getClassLoader().getResourceAsStream("success_messages.properties"));
        } catch (IOException e) {
            System.err.print("Error occurred while loading error file");
        }
    }

    public static String getSuccessMessage(String errorCode) {
        return successMessages.getProperty(errorCode);
    }
}
