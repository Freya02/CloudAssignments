package org.example;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping("/store-products")
    public ResponseEntity<String> saveProducts(@RequestBody Map<String, List<Product>> request) {
        List<Product> products = request.get("products");
        for (Product product : products) {
            productService.saveProduct(product);
        }
        return ResponseEntity.status(HttpStatus.OK).body("{\"message\": \"Success.\"}");
    }


    @GetMapping("/list-products")
    public Map<String, List<Map<String, Object>>> getAllProducts() {

        List<Product> products = productService.getAllProducts();
        List<Map<String, Object>> productFinal = new ArrayList<>();


        for(Product product:products){
            //System.out.println (product);
            Map<String, Object> productDet = new HashMap<> ();
            productDet.put("price",String.valueOf (product.getPrice()));
            productDet.put("name",product.getName());
            productDet.put("availability",product.isAvailability());
            productFinal.add(productDet);
        }

        Map<String, List<Map<String, Object>>> response = new HashMap<> ();
        response.put("products", productFinal);

        return response;
    }
}
