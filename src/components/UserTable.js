import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CustomAlert from './CustomAlert';

import { Box, Typography, TextField } from '@mui/material';


import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './UserTable.css';

const UserTable = () => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [first, setFirst] = useState(0); // Initialize first
    const [rows, setRows] = useState(10); // Default rows per page
    const [totalRecords, setTotalRecords] = useState(0);


    const fetchUsers = (e = { first: 0, rows: 10, sortField, sortOrder }) => {
        const { first, rows, sortField, sortOrder } = e;
        fetch(`http://localhost:8888/api/getUsers.php?offset=${first}&limit=${rows}&sortField=${sortField}&sortOrder=${sortOrder}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data); // Debug: Check the structure of the data
                setUsers(data.users); // Ensure data.users is an array
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const closeEditDialog = () => {
        setSelectedUser(null);
        setIsEditDialogOpen(false);
    }

    const editDialogHandler = (user) => {
        fetch(`http://localhost:8888/api/getUser.php?id=${user.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSelectedUser(data.user);
                    setIsEditDialogOpen(true);
                } else {
                    console.error('Error fetching user details:', data.message);
                }
            })
            .catch(error => console.error('Error fetching user details:', error));
    };

    const detailsHandler = (user) => {
        fetch(`http://localhost:8888/api/getUser.php?id=${user.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSelectedUser(data.user);
                    setIsDialogOpen(true);
                } else {
                    console.error('Error fetching user details:', data.message);
                }
            })
            .catch(error => console.error('Error fetching user details:', error));
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

    const deleteHandler = (user) => {
        console.log('Delete ID:', user.id);
        fetch('http://localhost:8888/api/deleteUser.php', {
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
                <Button className='p-button-warning' icon="pi pi-pencil" onClick={() => editDialogHandler(rowData)} />
                <Button className='p-button-danger' icon="pi pi-trash" onClick={() => {
                    deleteHandler(rowData);
                    setAlert(prevAlert => ({...prevAlert, visible: true, type: 'success', msg: 'User deleted successfully'}));
                }} />
            </div>
        );
    }

    const handleSort = async (event) => {
        const { sortField, sortOrder } = event;

        setSortField(sortField);
        setSortOrder(sortOrder);

        fetchUsers({ first, rows, sortField, sortOrder });
    };

    const submitEdit = () => {
        if (!selectedUser) return;
        console.log('Submitting edit:', selectedUser);

        const userData = {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
            address: selectedUser.address,
            city: selectedUser.city,
            date_of_birth: selectedUser.date_of_birth
        };

        // Include password only if it has been changed
        if (selectedUser.password) {
            userData.password = selectedUser.password;
        }
        else {
            userData.password = "";
        }

        fetch(`http://localhost:8888/api/updateUser.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Update the user list or notify the user of success
                setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
                closeEditDialog();
            } else {
                console.error('Error updating user1:', data.message);
            }
        })
        .catch(error => console.error('Error updating user:3', error));
    };

    return (
        <div className='manage-users'>
            <h1>User Management</h1>
            <CustomAlert alert={alert} onClose={() => setAlert({...alert, visible: false})} />
            <Box sx={{mt:4, width:'77%', margin:'0 auto'}}>
                <div className='datatable'>
                    <DataTable
                        value={users}
                        lazy
                        paginator
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        onPage={(e) => {
                            setFirst(e.first);
                            setRows(e.rows);
                            fetchUsers({ ...e, sortField, sortOrder });
                        }}
                        onSort={handleSort}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        tableStyle={{ minWidth: '50%' }}
                    >
                        <Column field='name' header='Name' sortable filter />
                        <Column field='email' header='Email' sortable filter />
                        <Column header='Actions' body={actionTemplate} />
                    </DataTable>
                </div>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
                <DialogTitle className="dialog-title">User Details</DialogTitle>
                <DialogContent className="dialog-content">
                    {selectedUser && (
                        <Box sx={{ padding: 3 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Role"
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                value={selectedUser.address}
                                onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="City"
                                value={selectedUser.city}
                                onChange={(e) => setSelectedUser({ ...selectedUser, city: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={selectedUser.date_of_birth}
                                onChange={(e) => setSelectedUser({ ...selectedUser, date_of_birth: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={closeDialog} color="primary" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isEditDialogOpen} onClose={closeEditDialog} maxWidth="md" fullWidth>
                <DialogTitle className="dialog-title">Edit User Details</DialogTitle>
                <DialogContent className="dialog-content">
                    {selectedUser && (
                        <Box sx={{ padding: 3 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Role"
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                value={selectedUser.address}
                                onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="City"
                                value={selectedUser.city}
                                onChange={(e) => setSelectedUser({ ...selectedUser, city: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={selectedUser.date_of_birth}
                                onChange={(e) => setSelectedUser({ ...selectedUser, date_of_birth: e.target.value })}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={submitEdit} color="primary" variant="contained">Save</Button>
                    <Button onClick={closeEditDialog} color="primary" variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UserTable
