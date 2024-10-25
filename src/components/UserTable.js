import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CustomAlert from './CustomAlert';

import { Box, Typography } from '@mui/material';


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
    const [first, setFirst] = useState(0); // Initialize first
    const [rows, setRows] = useState(10); // Default rows per page
    const [totalRecords, setTotalRecords] = useState(0);


    const fetchUsers = (e = { first: 0, rows: 10, sortField, sortOrder }) => {
        const { first, rows, sortField, sortOrder } = e;
        fetch(`http://localhost:8888/api/getUsers.php?offset=${first}&limit=${rows}&sortField=${sortField}&sortOrder=${sortOrder}`)
            .then(response => response.json())
            .then(data => {
                setUsers(data.users);
                setTotalRecords(data.total);
            })
            .catch(error => console.error('Error fetching users:', error));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
                <Button className='p-button-warning' icon="pi pi-pencil" onClick={() => editHandler(rowData)} />
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

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <div>
                            <Typography>Name: {selectedUser.name}</Typography>
                            <Typography>Email: {selectedUser.email}</Typography>
                            <Typography>Role: {selectedUser.role}</Typography>
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
