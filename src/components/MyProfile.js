import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Import the CSS file


function MyProfile() {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user data from the backend
        fetch('http://localhost:8888/getUser.php') // Adjust the URL to your endpoint
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user data:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send updated user data to the backend
        fetch('http://localhost:8888/updateUser.php', { // Adjust the URL to your endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setIsEditing(false);
                console.log('User data updated successfully');
            } else {
                console.error('Error updating user data:', data.message);
            }
        })
        .catch(error => console.error('Error updating user data:', error));
    };

    return (
        <div className="my-profile">
            <h1>My Profile</h1>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={user.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={user.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={user.password} onChange={handleChange} />
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
}

export default MyProfile;