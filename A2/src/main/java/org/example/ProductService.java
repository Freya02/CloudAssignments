package org.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.productRepository;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private productRepository repository;

    public void saveProduct(Product product) {
        repository.save(product);
    }

    public void saveProducts(List<Product> products) {
        repository.saveAll(products);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }
}
