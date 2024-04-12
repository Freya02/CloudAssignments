package org.example;

import jakarta.persistence.*;
import lombok.Data;

import lombok.Data;

@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String details;
    private String assignedTo;
    private String assignee;
    private String timeline;
    private boolean completed;
}
