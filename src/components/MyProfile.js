import React, { useState, useEffect } from 'react';
import './MyProfile.css'; // Import the CSS file


function MyProfile() {
    const [user, setUser] = useState({ name: '', email: '', password: '', role: '', address: '', city: '', date_of_birth: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user data from the backend
        fetch('http://localhost:8888/api/getUser.php') // Adjust the URL to your endpoint
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
        fetch('http://localhost:8888/api/updateUser.php', { // Adjust the URL to your endpoint
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
                    <div>
                        <label>Role:</label>
                        <input type="text" name="role" value={user.role} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input type="text" name="address" value={user.address} onChange={handleChange} />
                    </div>
                    <div>
                        <label>City:</label>
                        <input type="text" name="city" value={user.city} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Date of Birth:</label>
                        <input type="date" name="date_of_birth" value={user.date_of_birth} onChange={handleChange} />
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Address: {user.address}</p>
                    <p>City: {user.city}</p>
                    <p>Date of Birth: {user.date_of_birth}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
}

export default MyProfile;