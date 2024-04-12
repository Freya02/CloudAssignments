import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Modal,
  TextField,
  IconButton,
  Grid,
  Checkbox,
} from "@mui/material";
import { Close, Delete, Edit, Check } from "@mui/icons-material";
import axios from "axios";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./ToDoApp.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import config from './Config';

function ToDoApp() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [mobile, setMobileNumber] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  
  const deploymentUrl = config.deploymentUrl;
  console.log("deployment-url",deploymentUrl);


  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
      
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${deploymentUrl}/api/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const loggedInUser = user?.email;

  const createTask = async () => {
    console.log("Creating Task...");
    console.log("Task Name:", taskName);
    console.log("Assignee:", assignee);
    console.log("Assigned To:", assignedTo);
    console.log("Date:", date);
    console.log("Time:", time);
    console.log("Task Details:", taskDetails);

    if (taskName.trim() !== "" && assignedTo.trim() !== "" && date && time) {
      const newTask = {
        // id: tasks.length + 1,
        name: taskName,
        assignee: loggedInUser,
        assignedTo: assignedTo,
        timeline: new Date(`${date}T${time}:00`),
        details: taskDetails,
      };

      const response = await axios.post(
        `${deploymentUrl}/api/tasks`,
        newTask
      );

  
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setTaskName("");
      setAssignee("");
      setAssignedTo("");
      setDate("");
      setTime("");
      setTaskDetails("");
      setAddModalOpen(false);
      console.log("Task Created Successfully!");

      alert("Task Created Successfully!");
    } else {
      setErrorMessage("Failed to create task. Please fill in all required fields.");
      console.error(
        "Failed to create task. Please fill in all required fields."
      );
    }
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const deleteTask = async (taskId, assignee, assignedTo) => {
    console.log("assignedTo====", assignedTo);
    console.log("assignedTo====", taskId);
    if (loggedInUser === assignee) {
      try {
        await axios.delete(`${deploymentUrl}/api/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    } else {
      alert("Only the assignee can delete the task.");
    }
  };

  const markTaskCompleted = async (taskId, assignee, assignedTo) => {
    if (loggedInUser === assignee || loggedInUser === assignedTo) {
      try {
        const existingTask = tasks.find((task) => task.id === taskId);
        if (!existingTask) {
          console.error("Task not found");
          return;
        }
        const updatedTask = { ...existingTask, completed: true };
        const response = await axios.put(
          `${deploymentUrl}/api/tasks/${taskId}`,
          updatedTask
        );
        setTasks(
          tasks.map((task) => (task.id === taskId ? response.data : task))
        );
      } catch (error) {
        console.error("Error marking task as completed:", error);
      }

    } else {
      alert(
        "Only the assignee or assigned to can mark this task as completed."
      );
    }
  };
  const handleEdit = (taskId, assignee) => {
    console.log("assignee====", assignee);
    console.log("loggedInUser====", loggedInUser);
    if (loggedInUser === assignee){
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditedTask(taskToEdit);
    setEditModalOpen(true);
    }
    else {
      alert(
        "Only the assignee can edit task."
      );
  };
}

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${deploymentUrl}/api/tasks/${editedTask.id}`, editedTask);
      setTasks(tasks.map(task => (task.id === editedTask.id ? response.data : task)));
      setEditModalOpen(false);
      setEditedTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const closeModal = () => {
    setAddModalOpen(false);
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedTask(null);
    setTaskName("");
    setAssignee("");
    setDate("");
    setTime("");
    setTaskDetails("");
  };

  

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h3" style={{ marginBottom: "20px" }}>
        To Do App
      </Typography>
      <div style={{ marginBottom: "20px" }}>

        <Button 
          onClick={() => setAddModalOpen(true)}
          variant="contained"
          style={{ marginRight: "20px" }}
        >
          Add Task
        </Button>

        <Button  variant="contained" color = "primary" onClick={logout}>
          Logout
          </Button>
      </div>

      <Grid container spacing={2}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
            <Card
              style={{ marginBottom: "20px", cursor: "pointer" }}
              onClick={() => openTaskDetails(task)}
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  {task.name}
                </Typography>
                <Typography color="textSecondary">
                  Assignee: {task.assignee}
                </Typography>
                <Typography color="textSecondary">
                  Assigned To: {task.assignedTo}
                </Typography>
                <Typography color="textSecondary">
                Timeline: {new Date(task.timeline).toLocaleString()}
                  {/* {selectedTask ? new Date(selectedTask.timeline).toLocaleString() : ""} */}
                  {/* {selectedTask ? new Date(selectedTask.timeline).toLocaleString() : ""} */}
                </Typography>

                {console.log("loggedInUser", loggedInUser)}
                {console.log("task.assignee", task.assignee)}
                <CardActions>
                  <IconButton
                    color="secondary"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      console.log("loggedInUser:", loggedInUser);
                      console.log("task.assignedTo:", task.assignedTo);
                      deleteTask(task.id, task.assignee, task.assignedTo);
                    }}
                    style={{ color: 'red' }}
                  >
                    <Delete />
                  </IconButton>

                  <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      console.log("Edit task:", task.id);
                      handleEdit(task.id,  task.assignee);
                      
                    }}
                    style={{ color: 'gray' }}
                  >
                    <Edit />
                  </IconButton>

                  <Checkbox
                    checked={task.completed || false}
                    onChange={() =>
                      markTaskCompleted(task.id, task.assignee, task.assignedTo)
                    }
                    color="primary"
                  />
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Task Modal */}
      <Modal open={addModalOpen} onClose={closeModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            minWidth: "300px",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Add Task
          </Typography>
          <TextField
            label="Task Name"
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Task Details"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
          />
          <TextField
            label="Assigned To (Gmail)"
            variant="outlined"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Timeline - Date"
            variant="outlined"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Timeline - Time"
            variant="outlined"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button
              onClick={createTask}
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
            >
              Save
            </Button>
            <IconButton onClick={closeModal}>
              <Close />
            </IconButton>
          </div>
        </div>
      </Modal>

      <Modal open={viewModalOpen} onClose={closeModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            minWidth: "300px",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Task Details
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            {selectedTask && selectedTask.name}
          </Typography>
          <Typography color="textSecondary">
            Assignee: {selectedTask && selectedTask.assignee}
          </Typography>
          <Typography color="textSecondary">
            Assigned To: {selectedTask && selectedTask.assignedTo}
          </Typography>
          <Typography color="textSecondary">
            Timeline: {selectedTask && selectedTask.timeline.toLocaleString()}
          </Typography>
          <Typography color="textSecondary">
            Details: {selectedTask && selectedTask.details}
          </Typography>
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <IconButton onClick={closeModal}>
              <Close />
            </IconButton>
          </div>
        </div>
      </Modal>
      <Modal open={editModalOpen} onClose={closeModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            minWidth: "300px",
            maxWidth: "600px",
          }}
        >
          <Typography variant="h5">Edit Task</Typography>
          <TextField
            label="Task Name"
            value={editedTask ? editedTask.name : ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        
        <TextField
            label="Task Details"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={editedTask ? editedTask.details : ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, details: e.target.value })
            }
            margin="normal"
          />

          <TextField
            label="Assigned To"
            value={editedTask ? editedTask.assignedTo : ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, assignedTo: e.target.value })
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Timeline - Date"
            variant="outlined"
            type="date"
            value={editedTask ? editedTask.timeline.split("T")[0] : ""}
            onChange={(e) =>
              setEditedTask({
                ...editedTask,
                timeline: `${e.target.value}T${
                  editedTask ? editedTask.timeline.split("T")[1] : ""
                }`,
              })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Timeline - Time"
            variant="outlined"
            type="time"
            value={
              editedTask
                ? editedTask.timeline.split("T")[1].substring(0, 5)
                : ""
            }
            onChange={(e) =>
              setEditedTask({
                ...editedTask,
                timeline: `${
                  editedTask ? editedTask.timeline.split("T")[0] : ""
                }T${e.target.value}:00`,
              })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Button variant="contained" color="primary" onClick={handleSaveEdit}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </Modal>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
    
  );
}

export default ToDoApp
