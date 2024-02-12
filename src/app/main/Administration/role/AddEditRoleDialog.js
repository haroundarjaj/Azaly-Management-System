import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import "profile-picture/build/ProfilePicture.css";
import RoleService from "src/app/services/RoleService";
import { useForm } from "react-hook-form";
import PermissionService from "src/app/services/PermissionService";

function AddEditRoleDialog(props) {
    const tRole = useTranslation('rolesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        handleShowNotification,
        open,
        selectedRole
    } = props;

    const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

    const [permissions, setPermissions] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const actionsList = ["ACCESS", "ADD", "EDIT", "DELETE"];

    const onClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return false;
        }

        if (reason === 'escapeKeyDown') {
            return false;
        }

        if (typeof onClose === 'function') {
            handleClose();
        }
    };

    const handleSave = (data) => {
        const permissions = selectedPermissions.length > 0 ? selectedPermissions.map(permission => (permission.id)) : [];
        const role = {
            ...data,
            permissions
        }

        if (selectedRole) {
            role.id = selectedRole.id;
            RoleService.update(role).then(({ data }) => {
                handleUpdateDone(data);
            }).catch(err => {
                if (err.response.data.cause) {
                    handleShowNotification(tRole(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        } else {
            RoleService.add(role).then(({ data }) => {
                handleAddDone(data);
            }).catch(err => {
                if (err.response.data.cause) {
                    handleShowNotification(tRole(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        };
    }

    const handleError = (status) => {
        if (status === 'INVALID_FILE_TYPE') {

        } else if (status === 'INVALID_IMAGE_SIZE') {

        }
    };

    const handleCheck = (permission) => {
        if (selectedPermissions.filter(selected => selected.id === permission.id).length > 0) {
            let list = selectedPermissions.filter(elem => elem.id !== permission.id);
            setSelectedPermissions(list)
        } else {
            setSelectedPermissions([...selectedPermissions, permission])
        }
    }

    useEffect(() => {
        if (open && selectedRole) {
            reset(selectedRole)
            console.log("selectedRole", selectedRole)
            setSelectedPermissions(selectedRole.permissions ? [...selectedRole.permissions] : [])
        } else {
            reset({
                name: '',
                code: '',
                description: ''
            });
            setSelectedPermissions([]);
        };
    }, [open])

    useEffect(() => {
        PermissionService.getAll().then(response => {
            setPermissions(response.data);
            let listSubjects = response.data.map(elem => {
                return elem.subject
            })
            const subjects = listSubjects.filter((val, id, array) => array.indexOf(val) == id);
            setSubjectsList(subjects)
        })
    }, [])

    const generatePermissionsTable = () => {
        return (
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 270 }}>
                    <Table stickyHeader >
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                {actionsList.map(action => (<TableCell>{tRole(action)}</TableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjectsList?.map((subject) => (
                                <TableRow key={subject}  >
                                    <TableCell align="left">{tRole(subject)}</TableCell>
                                    {actionsList.map(action => {
                                        let permission = permissions.filter(perm => perm.action === action && perm.subject === subject)[0];
                                        return (
                                            <TableCell align="left">
                                                <Checkbox
                                                    checked={selectedPermissions.filter(selected => selected.id === permission?.id).length > 0}
                                                    onChange={() => handleCheck(permission)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                                />
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

    console.log(selectedPermissions)
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {selectedRole ? tRole('edit_title') : tRole('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedRole ? tRole('edit_desc') : tRole('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>
                <form
                    id="add-role-form"
                    onSubmit={handleSubmit(handleSave)}
                >
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        direction="row"
                    >
                        <Grid item xs={3}>
                            <TextField
                                id="name"
                                label={tGeneral("name")}
                                variant="outlined"
                                name="name"
                                required
                                fullWidth
                                defaultValue={selectedRole?.name}
                                {...register('name')}
                            //style={{ marginTop: 23 }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="code"
                                label={tGeneral("code")}
                                variant="outlined"
                                name="code"
                                required
                                fullWidth
                                defaultValue={selectedRole?.code}
                                {...register('code')}
                            //style={{ marginTop: 23 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="description"
                                label={tGeneral("description")}
                                variant="outlined"
                                name="description"
                                fullWidth
                                defaultValue={selectedRole?.description}
                                {...register('description')}
                            />
                        </Grid>
                    </Grid>
                </form>
                <Typography variant="subtitle1" color="secondary" className="my-16">{`${tRole('permissions')}:`}</Typography>
                {generatePermissionsTable()}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                <Button onClick={handleSave} color="secondary" type="submit" form="add-role-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditRoleDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedRole: PropTypes.object,
}

AddEditRoleDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedRole: null,
}

export default AddEditRoleDialog;