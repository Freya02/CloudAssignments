package org.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Md5Function implements RequestHandler<Request, Void> {

    @Override
    public Void handleRequest(Request input, Context context) {
        try {
            String action = input.getAction();
            String value = input.getValue();
            String course_uri = input.getcourse_uri();


            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(value.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            StringBuilder hashText = new StringBuilder(no.toString(16));
            while (hashText.length() < 32) {
                hashText.insert(0, "0");
            }


            Response response = new Response();
            response.setBanner("B00961402");
            response.setResult(hashText.toString());
            response.setArn("arn:aws:lambda:us-east-1:654654570983:function:Sha256");
            response.setAction(action);
            response.setValue(value);

            RestTemplate restTemplate = new RestTemplate ();
            restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter ());
            restTemplate.postForObject(course_uri, response, String.class);

            return null;

        } catch (NoSuchAlgorithmException e) {
            return null;
        }
    }
}
