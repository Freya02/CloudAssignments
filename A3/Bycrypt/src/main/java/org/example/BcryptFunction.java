package org.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

public class BcryptFunction implements RequestHandler<Request, Void> {

    @Override
    public Void handleRequest(Request input, Context context) {
        try {

            String action = input.getAction();
            String value = input.getValue();
            String course_uri = input.getcourse_uri();

            //return BCrypt.hashpw(value, BCrypt.gensalt());

            Response response = new Response();
            response.setBanner("B00961402");
            response.setResult(BCrypt.hashpw(value, BCrypt.gensalt()));
            response.setArn("arn:aws:lambda:us-east-1:654654570983:function:Sha256");
            response.setAction(action);
            response.setValue(value);

            RestTemplate restTemplate = new RestTemplate ();
            restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter ());
            restTemplate.postForObject(course_uri, response, String.class);

            return null;


        } catch (Exception e) {
            return null;
        }
    }
}
