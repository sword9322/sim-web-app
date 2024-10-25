import React, { useState } from 'react';
import './UserForm.css';
import { TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import CustomAlert from './CustomAlert'; // Import the CustomAlert component

function UserForm() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
        address: '',
        city: '',
        dateOfBirth: '',
    });

    const [alert, setAlert] = useState({
        visible: false,
        type: 'error',
        msg: 'Please fill in all required fields'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for missing required fields
        if (!formData.name || !formData.email || !formData.password) {
            setAlert({ ...alert, visible: true });
            return;
        }

        try {
            const response = await fetch('http://localhost:8888/api/saveUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setAlert({
                    visible: true,
                    type: 'success',
                    msg: 'User data saved successfully'
                });
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'User',
                    address: '',
                    city: '',
                    dateOfBirth: '',
                });
            } else {
                setAlert({
                    visible: true,
                    type: 'error',
                    msg: 'Failed to save user data'
                });
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    return (
        <div className='user-form-container'>
            <h1>Create User</h1>
            <CustomAlert alert={alert} onClose={() => setAlert({ ...alert, visible: false })} />
            <Box sx={{ mt: 4 }}>
                <form onSubmit={handleSubmit} className='user-form'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="User Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="User">User</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Save User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </div>
    )
}

export default UserForm;
