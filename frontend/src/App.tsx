import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Container, Grid, Typography, List, ListItem, ListItemText, ListItemIcon, TextField, Button, Card, CardContent, IconButton, CircularProgress, Checkbox } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Work as WorkIcon, Person as PersonIcon, ShoppingCart as ShoppingCartIcon, Favorite as FavoriteIcon } from '@mui/icons-material';

type Task = {
  id: bigint;
  text: string;
  categoryId: bigint;
  completed: boolean;
};

type Category = {
  id: bigint;
  name: string;
};

const categoryIcons = {
  1: WorkIcon,
  2: PersonIcon,
  3: ShoppingCartIcon,
  4: FavoriteIcon,
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  async function fetchTasks() {
    const fetchedTasks = await backend.getTasks();
    setTasks(fetchedTasks);
  }

  async function fetchCategories() {
    const fetchedCategories = await backend.getCategories();
    setCategories(fetchedCategories);
    if (fetchedCategories.length > 0) {
      setSelectedCategory(fetchedCategories[0].id);
    }
  }

  async function addTask() {
    if (newTask.trim() !== '' && selectedCategory !== null) {
      setLoading(true);
      await backend.addTask(newTask, selectedCategory);
      setNewTask('');
      await fetchTasks();
      setLoading(false);
    }
  }

  async function deleteTask(id: bigint) {
    setLoading(true);
    await backend.deleteTask(id);
    await fetchTasks();
    setLoading(false);
  }

  async function toggleTaskCompletion(id: bigint) {
    setLoading(true);
    await backend.toggleTaskCompletion(id);
    await fetchTasks();
    setLoading(false);
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <List>
              {categories.map((category) => {
                const Icon = categoryIcons[Number(category.id) as keyof typeof categoryIcons];
                return (
                  <ListItem
                    key={Number(category.id)}
                    button
                    selected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={category.name} />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              Task List
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={addTask}
                disabled={loading}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            )}
            {tasks
              .filter((task) => selectedCategory === null || task.categoryId === selectedCategory)
              .map((task) => (
                <Card key={Number(task.id)} sx={{ mb: 2 }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        color="primary"
                      />
                      <Typography
                        variant="body1"
                        sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                      >
                        {task.text}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => deleteTask(task.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;