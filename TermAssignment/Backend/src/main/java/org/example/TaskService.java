package org.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.TaskRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Integer id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        return taskOptional.orElse(null);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Integer id, Task updatedTask) {
        Optional<Task> existingTaskOptional = taskRepository.findById(id);
        if (existingTaskOptional.isPresent()) {
            Task existingTask = existingTaskOptional.get();
            existingTask.setName(updatedTask.getName());
            existingTask.setAssignee(updatedTask.getAssignee());
            existingTask.setAssignedTo(updatedTask.getAssignedTo());
            existingTask.setTimeline(updatedTask.getTimeline());
            existingTask.setDetails(updatedTask.getDetails());
            existingTask.setCompleted(updatedTask.isCompleted());
            return taskRepository.save(existingTask);
        } else {
            return null; // Task with given ID not found
        }
    }

    public boolean deleteTask(Integer id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            taskRepository.deleteById(id);
            return true;
        } else {
            return false; // Task with given ID not found
        }
    }
}
