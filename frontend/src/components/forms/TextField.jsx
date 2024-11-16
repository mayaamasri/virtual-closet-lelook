import React from 'react';
import { TextField } from '@mui/material';

const TextInput = ({ error, ...props }) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      error={!!error}
      helperText={error}
      {...props}
    />
  );
};

export default TextInput;