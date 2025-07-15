import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Business,
  Work,
  Assignment,
  Person,
  CalendarToday,
  Save,
  Cancel
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmployeeStore } from '../../store/useEmployeeStore';
import * as timesheetApi from '../../api/timesheet';

interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'on_hold';
}

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
}

const ProjectTaskManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    status: 'active' as const
  });
  
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    projectId: '',
    status: 'active' as const
  });
  
  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await timesheetApi.getTimesheetProjects();
        setProjects(response);
      } catch (error) {
        setError('Failed to fetch projects');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Fetch tasks for a project
  const fetchTasks = async (projectId: string) => {
    if (tasks[projectId]) return; // Already fetched
    
    setIsLoading(true);
    try {
      const response = await timesheetApi.getProjectTasks(projectId);
      setTasks(prev => ({
        ...prev,
        [projectId]: response
      }));
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateProject = () => {
    setSelectedProject(null);
    setNewProject({
      name: '',
      client: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      status: 'active'
    });
    setProjectDialogOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setNewProject({
      name: project.name,
      client: project.client,
      description: project.description,
      startDate: format(new Date(project.startDate), 'yyyy-MM-dd'),
      endDate: project.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '',
      status: project.status
    });
    setProjectDialogOpen(true);
  };
  
  const handleCreateTask = (projectId: string) => {
    setSelectedTask(null);
    setNewTask({
      name: '',
      description: '',
      projectId,
      status: 'active'
    });
    setTaskDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      projectId: task.projectId,
      status: task.status
    });
    setTaskDialogOpen(true);
  };
  
  const handleSaveProject = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call the API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedProject) {
        // Update existing project
        const updatedProject = {
          ...selectedProject,
          name: newProject.name,
          client: newProject.client,
          description: newProject.description,
          startDate: new Date(newProject.startDate),
          endDate: newProject.endDate ? new Date(newProject.endDate) : undefined,
          status: newProject.status
        };
        
        setProjects(prev => 
          prev.map(p => p.id === selectedProject.id ? updatedProject : p)
        );
      } else {
        // Create new project
        const newProjectData = {
          id: `project-${Date.now()}`,
          name: newProject.name,
          client: newProject.client,
          description: newProject.description,
          startDate: new Date(newProject.startDate),
          endDate: newProject.endDate ? new Date(newProject.endDate) : undefined,
          status: newProject.status
        };
        
        setProjects(prev => [...prev, newProjectData]);
      }
      
      setProjectDialogOpen(false);
    } catch (error) {
      setError('Failed to save project');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveTask = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call the API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedTask) {
        // Update existing task
        const updatedTask = {
          ...selectedTask,
          name: newTask.name,
          description: newTask.description,
          status: newTask.status
        };
        
        setTasks(prev => ({
          ...prev,
          [updatedTask.projectId]: prev[updatedTask.projectId].map(t => 
            t.id === selectedTask.id ? updatedTask : t
          )
        }));
      } else {
        // Create new task
        const newTaskData = {
          id: `task-${Date.now()}`,
          projectId: newTask.projectId,
          name: newTask.name,
          description: newTask.description,
          status: newTask.status
        };
        
        setTasks(prev => ({
          ...prev,
          [newTask.projectId]: [...(prev[newTask.projectId] || []), newTaskData]
        }));
      }
      
      setTaskDialogOpen(false);
    } catch (error) {
      setError('Failed to save task');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would call the API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Also remove tasks for this project
      const newTasks = { ...tasks };
      delete newTasks[projectId];
      setTasks(newTasks);
    } catch (error) {
      setError('Failed to delete project');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId: string, projectId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would call the API
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTasks(prev => ({
        ...prev,
        [projectId]: prev[projectId].filter(t => t.id !== taskId)
      }));
    } catch (error) {
      setError('Failed to delete task');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project & Task Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage projects and tasks for timesheet tracking.
        </Typography>
      </Box>
      
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Projects Section */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Projects" 
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateProject}
            >
              Add Project
            </Button>
          }
        />
        <CardContent>
          {projects.length === 0 ? (
            <Alert severity="info">
              No projects found. Create your first project to get started.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {project.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {project.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>{format(new Date(project.startDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'Ongoing'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={project.status.replace('_', ' ').toUpperCase()} 
                          color={
                            project.status === 'active' ? 'success' : 
                            project.status === 'completed' ? 'info' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Delete />
                          </IconButton>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => {
                              fetchTasks(project.id);
                              handleCreateTask(project.id);
                            }}
                          >
                            Add Task
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      
      {/* Tasks Section */}
      {projects.map((project) => (
        <Card key={project.id} sx={{ mb: 3 }}>
          <CardHeader 
            title={`Tasks for ${project.name}`}
            subheader={`Client: ${project.client}`}
            action={
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => {
                  fetchTasks(project.id);
                  handleCreateTask(project.id);
                }}
              >
                Add Task
              </Button>
            }
          />
          <CardContent>
            {!tasks[project.id] ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => fetchTasks(project.id)}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Assignment />}
                  disabled={isLoading}
                >
                  Load Tasks
                </Button>
              </Box>
            ) : tasks[project.id].length === 0 ? (
              <Alert severity="info">
                No tasks found for this project. Add tasks to track time against them.
              </Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Task Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks[project.id].map((task) => (
                      <TableRow key={task.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {task.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={task.status.toUpperCase()} 
                            color={task.status === 'active' ? 'success' : 'info'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditTask(task)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteTask(task.id, task.projectId)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Project Dialog */}
      <Dialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client"
                value={newProject.client}
                onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date (Optional)"
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newProject.status}
                  onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as any }))}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setProjectDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveProject}
            startIcon={<Save />}
            disabled={isLoading || !newProject.name || !newProject.client || !newProject.startDate}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Project'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Task Dialog */}
      <Dialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Task Name"
                value={newTask.name}
                onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTask.status}
                  onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value as any }))}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setTaskDialogOpen(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveTask}
            startIcon={<Save />}
            disabled={isLoading || !newTask.name}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTaskManagement;