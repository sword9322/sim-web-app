import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CustomAlert from './CustomAlert';

import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';


import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './UserTable.css';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch users from the backend
        fetch('http://localhost:8888/api/getUsers.php') // Adjust the URL to your endpoint
            .then(response => response.json())
            .then(data => {
                console.log(data); // Debug: Check if 'role' is present in the data
                setUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []); // Add an empty dependency array to run this effect only once

    const detailsHandler = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const [alert, setAlert] = useState({
        visible: false,
        type: 'success',
        msg: 'User deleted successfully'
    });

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
    };

    const editHandler = (user) => {
        console.log('Edit user:', user);
    }

    const deleteHandler = (user) => {
        // Delete user from the backend
        console.log('Delete ID:', user.id);
        fetch('http://localhost:8888/api/deleteUser.php', { // Adjust the URL to your endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: user.id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUsers(users.filter(u => u.id !== user.id));
            } else {
                console.error('Error deleting user:', data.message);
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
    const actionTemplate = (rowData) => {
       return (
            <div className='p-buttonset'>
                <Button className='p-button-info' icon="pi pi-eye" onClick={() => detailsHandler(rowData)} />
                <Button className='p-button-warning' icon="pi pi-pencil" onClick={() => editHandler(rowData)} />
                <Button className='p-button-danger' icon="pi pi-trash" onClick={() => {
                    deleteHandler(rowData);
                    setAlert(prevAlert => ({...prevAlert, visible: true, type: 'success', msg: 'User deleted successfully'}));
                }} />
            </div>
        );
    }

  return (
    <div className='manage-users'>
        <h1>User Management</h1>
        <CustomAlert alert={alert} onClose={() => setAlert({...alert, visible: false})} />
        <Box sx={{mt:4, width:'77%', margin:'0 auto'}}>
            <div className='datatable'>
                <DataTable className='user-table' value={users} tableStyle={{ minWidth: '50%' }}>
                    <Column field='name' header='Name' />
                    <Column field='email' header='Email' />
                    <Column field='role' header='Role' />  // Ensure this column is present
                    <Column header='Actions' body={actionTemplate} />
                </DataTable>
            </div>
        </Box>

        <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
                {selectedUser && (
                    <div>
                        <Typography>Name: {selectedUser.name}</Typography>
                        <Typography>Email: {selectedUser.email}</Typography>
                        <Typography>Role: {selectedUser.role}</Typography> {/* Add role here if needed */}
                        {/* Add more fields as needed */}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    </div>
  )
}

export default UserTable
