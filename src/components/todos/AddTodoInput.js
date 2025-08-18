import React, { useState } from 'react';
import RichTextEditor from '../shared/RichTextEditor';
import { Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create dark theme for Material-UI components
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#262626', // neutral-800
    },
    success: {
      main: '#10b981', // green-500
    },
    text: {
      primary: '#ffffff',
    },
  },
  components: {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            backgroundColor: '#262626',
            border: '1px solid #404040',
          },
        },
      },
    },
  },
});

const AddTodoInput = ({ newTodoText, setNewTodoText, onAddTodo }) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      onAddTodo();
      setNewTodoText(''); // Clear the input field
      setShowSnackbar(true); // Show success notification
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddTodo();
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="border-t border-neutral-700 pt-4 mt-6">
        <div className="relative" onKeyDown={handleKeyDown}>
          <RichTextEditor
            value={newTodoText}
            onChange={setNewTodoText}
            placeholder="Add a new to-do..."
          />
          <button
            onClick={handleAddTodo}
            className="absolute right-2 bottom-2 px-3 py-1.5 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 border border-neutral-600 transition-colors text-sm"
          >
            Add
          </button>
        </div>
        
        {/* Success Snackbar */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              '& .MuiAlert-icon': {
                color: '#ffffff',
              },
              '& .MuiAlert-action': {
                color: '#ffffff',
              },
            }}
          >
            To-Do added successfully.
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default AddTodoInput;