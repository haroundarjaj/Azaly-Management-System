import React, { useEffect, useState } from "react";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, Portal, Tooltip, Typography } from "@mui/material";
import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from "react-i18next";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import UserService from "src/app/services/UserService";
import PropTypes from 'prop-types';

function UserRequestsDialog(props) {

    const { open, handleClose, userRequests, fetchUserRequests, fetchApprovedUsers } = props;

    const tGeneral = useTranslation('generalTranslations').t;
    const tUser = useTranslation('usersPage').t;

    const [currentImage, setCurrentImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [operationType, setOperationType] = useState(null);

    const renderColumns = () => {
        return [
            {
                name: 'image',
                label: tGeneral('image'),
                options: {
                    customBodyRender: (value, row) => (
                        <Avatar
                            alt={tGeneral('profile_picture')}
                            src={value || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                            style={{ width: 60, height: 60 }}
                            onClick={() => handleOpenImageViewer(value)}
                        />
                    )

                }
            },
            {
                label: tGeneral('first_name'),
                name: 'firstName',
            },
            {
                label: tGeneral('last_name'),
                name: 'lastName'
            },
            {
                label: tGeneral('phone_number'),
                name: 'phoneNumber'
            },
            {
                label: tGeneral('email'),
                name: 'email'
            },
            {
                label: tGeneral('address'),
                name: 'address'
            },
            {
                name: 'actions',
                label: tGeneral('actions'),
                options: {
                    sort: false,
                    customBodyRender: (value, row) => (
                        <>
                            <Tooltip title={tGeneral('approve')}>
                                <IconButton
                                    aria-label="more"
                                    size="large"
                                    color="success"
                                    onClick={() => handleOpenConfirmation(userRequests[row.rowIndex], 'approve')}
                                >
                                    <FuseSvgIcon>heroicons-outline:check</FuseSvgIcon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={tGeneral('reject')}>
                                <IconButton
                                    aria-label="more"
                                    size="large"
                                    color="error"
                                    onClick={() => handleOpenConfirmation(userRequests[row.rowIndex], 'reject')}
                                >
                                    <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                                </IconButton>
                            </Tooltip>
                        </>
                    )

                }
            },
        ]
    }

    const handleOpenImageViewer = (image) => {
        setCurrentImage(image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`);
        setIsViewerOpen(true);
    };

    const handleCloseImageViewer = () => {
        setIsViewerOpen(false);
        setTimeout(() => {
            setCurrentImage(0);
        }, 500)

    };

    const handleOpenConfirmation = (user, opType) => {
        setSelectedUser(user);
        setIsOpenConfirmationDialog(true);
        setOperationType(opType)
    }

    const handleCloseConfirmation = () => {
        setSelectedUser(null);
        setIsOpenConfirmationDialog(false);
        setOperationType(null)
    }

    const handleConfirmOperation = () => {
        console.log(selectedUser, `${operationType}ed`)
        if (operationType === "approve") {
            UserService.approveUser(selectedUser.id).then((response) => {
                console.log(response)
                if (response.data) {
                    handleCloseConfirmation()
                    // dispatch(showMessage({ message: 'Approved Successfully', variant: 'success' }));
                    fetchUserRequests();
                    fetchApprovedUsers();
                }
            });
        }
        else if (operationType === "reject") {
            UserService.delete(selectedUser.id).then(({ data }) => {
                if (data) {
                    handleCloseConfirmation()
                    // dispatch(showMessage({ message: 'Rejected Successfully', variant: 'success' }));
                    fetchUserRequests();
                }
            });
        }
    }

    useEffect(() => {
        if (userRequests.length === 0) {
            handleClose()
        }
    }, [userRequests])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='lg'
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {tUser('user_requests_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {tUser('user_requests_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <ImageViewer open={isViewerOpen} handleClose={handleCloseImageViewer} image={currentImage} />
                <GeneralTable
                    data={userRequests}
                    columns={renderColumns()}
                    showToolBar={false}
                    selectableRows="none"
                />
                <InformationDialog
                    open={isOpenConfirmationDialog}
                    variant="warning"
                    content={operationType === "approve" ? tUser('approve_validation') : tUser('reject_validation')}
                    handleConfirm={handleConfirmOperation}
                    handleClose={handleCloseConfirmation}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {tGeneral('close')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

UserRequestsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    userRequests: PropTypes.array.isRequired,
    fetchUserRequests: PropTypes.func.isRequired,
    fetchApprovedUsers: PropTypes.func.isRequired,
}

UserRequestsDialog.defaultProps = {
    open: false,
    handleClose: () => { },
    userRequests: [],
    fetchUserRequests: () => { },
    fetchApprovedUsers: () => { },
}

export default UserRequestsDialog;