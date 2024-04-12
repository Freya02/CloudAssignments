package org.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Sha256Function implements RequestHandler<Request, Void> {

    @Override
    public Void handleRequest(Request input, Context context) {
        try {
            String action = input.getAction();
            String value = input.getValue();
            String course_uri = input.getcourse_uri();

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            Response response = new Response();
            response.setBanner("B00961402");
            response.setResult(hexString.toString());
            response.setArn("arn:aws:lambda:us-east-1:654654570983:function:Sha256");
            response.setAction(action);
            response.setValue(value);

            RestTemplate restTemplate = new RestTemplate ();
            restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter ());
            restTemplate.postForObject(course_uri, response, String.class);

            return null;
        } catch (NoSuchAlgorithmException e) {
            context.getLogger().log("Error processing request: " + e.getMessage());
            return null;
        }
    }
}
