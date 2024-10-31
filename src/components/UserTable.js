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
import UserForm from './UserForm';
const UserTable = () => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [initialFormData, setInitialFormData] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [first, setFirst] = useState(0); 
    const [rows, setRows] = useState(10); 
    const [totalRecords, setTotalRecords] = useState(0);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);


    const fetchUsers = (e = { first: 0, rows, sortField, sortOrder }) => {
        const { first, rows, sortField, sortOrder } = e;
        const filter = e.filter;
        fetch(`http://localhost:8888/api/getUsers.php?offset=${first}&limit=${rows}&sortField=${sortField}&sortOrder=${sortOrder}`)
            .then(response => response.json())
            .then(data => {
                setUsers(data.users);
                setTotalRecords(data.totalRecords); // Ensure this is set
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
                    setInitialFormData(data.user); 
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
                <Button className='p-button-danger' icon="pi pi-trash" onClick={() => confirmDeleteHandler(rowData)} />
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

        if (selectedUser.password) {
            userData.password = selectedUser.password;
        } else {
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
                setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
                closeEditDialog();
            } else {
                console.error('Error updating user:', data.message);
            }
        })
        .catch(error => console.error('Error updating user:', error));
    };

    const cancelEdit = () => {
        setSelectedUser(initialFormData); 
        closeEditDialog();
    };

    const confirmDeleteHandler = (user) => {
        setUserToDelete(user);
        setIsConfirmDialogOpen(true);
    };

    const handleDeleteConfirmation = () => {
        if (!userToDelete) return;
        deleteHandler(userToDelete);
        setIsConfirmDialogOpen(false);
        fetchUsers();
    };

    const handleFilter = (e) => {
        const value = e.target.value;
        fetchUsers({ first, rows, sortField, sortOrder, filter: value });
    };

    return (
        <div className='manage-users'>
            <h1>User Management</h1>
            <CustomAlert alert={alert} onClose={() => setAlert({...alert, visible: false})} />
            <Box sx={{mt:4, width:'77%', margin:'0 auto'}}>
                <div className='datatable'>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsNewUserDialogOpen(true)}
                        style={{ marginBottom: '10px' }} /* Reduced margin */
                    >
                        Add New User
                    </Button>
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
                            fetchUsers({ first: e.first, rows: e.rows, sortField, sortOrder });
                        }}
                        onFilter={handleFilter}

                        sortField={sortField}
                        sortOrder={sortOrder}

                        onSort={(e) => {
                            setSortField(e.sortField);
                            setSortOrder(e.sortOrder);
                            fetchUsers({ first, rows, sortField: e.sortField, sortOrder: e.sortOrder });
                        }}
                        rowsPerPageOptions={[5, 10, 20, 50, 100]}
                        tableStyle={{ minWidth: '50%' }}
                    >
                        <Column field='name' header='Name' sortable filter />
                        <Column field='email' header='Email' sortable filter />
                        <Column field='role' header='Role' sortable filter />
                        <Column field='date_of_birth' header='Date of Birth' sortable filter />
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
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={selectedUser.email}
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Role"
                                value={selectedUser.role}
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                    classes: {
                                        input: 'non-selectable', 
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                value={selectedUser.address}
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="City"
                                value={selectedUser.city}
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={selectedUser.date_of_birth}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={selectedUser.password}
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
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
                                variant="outlined"
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                    classes: {
                                        input: 'non-selectable', 
                                    },
                                }}
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
                            <TextField
                                fullWidth
                                label="Password"
                                value={selectedUser.password}
                                onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                variant="outlined"
                                margin="normal"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={submitEdit} color="primary" variant="contained">Save</Button>
                    <Button onClick={cancelEdit} color="primary" variant="contained">Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isConfirmDialogOpen} onClose={() => setIsConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmDialogOpen(false)} color="primary" variant="contained">Cancel</Button>
                    <Button onClick={handleDeleteConfirmation} color="secondary" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isNewUserDialogOpen} onClose={() => setIsNewUserDialogOpen(false)} maxWidth="sm" fullWidth>
                
                <DialogContent>
                    <UserForm onClose={() => setIsNewUserDialogOpen(false)} onUserAdded={fetchUsers} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UserTable
