import React, { useState, useEffect } from "react";
import './Dashboard.css';

function Dashboard() {
    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const storedContent = 120; // Example data
    const mostViewedItems = [
        { id: 1, title: "Video 1", views: 150 },
        { id: 2, title: "Image 2", views: 120 },
        { id: 3, title: "Article 3", views: 100 },
    ];

    useEffect(() => {
        fetch('http://localhost:8888/api/getTotalUsers.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setNumberOfUsers(data.total);
                } else {
                    console.error('Error fetching user count:', data.message);
                }
            })
            .catch(error => console.error('Error fetching user count:', error));
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard">
                
                <div>
                    <h2>App Utilization</h2>
                    <p>Stored Content: {storedContent}</p>
                    <p>Number of Users: {numberOfUsers}</p>
                    <h2>Most Viewed Multimedia Items</h2>
                    <ul>
                        {mostViewedItems.map(item => (
                            <li key={item.id}>
                                {item.title} - {item.views} views
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;