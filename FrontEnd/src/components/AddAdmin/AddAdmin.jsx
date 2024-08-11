// AddAdminForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';

const AddAdminForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/admin/', {
                email,
                password,
            });

            console.log('Admin user created:', response.data);
            // Optionally, show success message or redirect to admin dashboard
        } catch (error) {
            console.error('Error creating admin user:', error);
            // Optionally, show error message to the user
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>Add Admin User</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Create Admin User
                </Button>
            </form>
        </div>
    );
};

export default AddAdminForm;
