import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditUserDialog from "./AddEditUserDialog";
import { useContext, useEffect, useState } from "react";
import UserService from "src/app/services/UserService";
import { Avatar, Badge, Button, Paper, Switch } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewUserDialog from "./PreviewUserDialog";
import EncryptingTools from "src/app/utils/EncryptingTools";
import UserRequestsDialog from "./UserRequestsDialog";
import { AbilityContext } from "src/app/auth/Can";

let setSelectedRowsFunc = null;

function UserMainPage(props) {
    const tUser = useTranslation('usersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditUserDialog, setIsOpenAddEditUserDialog] = useState(false);
    const [isOpenPreviewUserDialog, setIsOpenPreviewUserDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isOpenRequestsDialog, setIsOpenRequestsDialog] = useState(false);

    const dispatch = useDispatch();
    const ability = useContext(AbilityContext);

    const renderColumns = () => {
        return [
            {
                name: 'image',
                label: tGeneral('image'),
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, row) => (
                        <Avatar
                            alt={tGeneral('profile_picture')}
                            src={value || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                            style={{ width: 60, height: 60 }}
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
                name: 'lastName',
                options: {
                    filter: false,
                }
            },
            {
                label: tGeneral('phone_number'),
                name: 'phoneNumber',
                options: {
                    filter: false,
                }
            },
            {
                label: tGeneral('email'),
                name: 'email',
                options: {
                    filter: false,
                }
            },
            {
                label: tGeneral('address'),
                name: 'address',
                options: {
                    display: false,
                    filter: false,
                }
            },
            {
                label: tUser('activated'),
                name: 'active',
                options: {
                    download: false,
                    customBodyRender: (value, row) => (
                        <div className="flex flex-row items-center">
                            {console.log("testvalue", row)}
                            {console.log("testvalue", value)}
                            <Button
                                color={value === false ? 'secondary' : 'primary'}
                                onClick={() => handleChangeUserActivation(row)}
                            >
                                {tUser('inactive')}
                            </Button>
                            <Switch
                                size="small"
                                style={{ border: 'none' }}
                                checked={value}
                                onChange={() => handleChangeUserActivation(row)}
                            />
                            <Button
                                color={value === true ? 'secondary' : 'primary'}
                                onClick={() => handleChangeUserActivation(row)}
                            >
                                {tUser('active')}
                            </Button>
                        </div>
                    )

                }
            }
        ]
    }

    const handleOpenAddEditUserDialog = () => {
        setIsOpenAddEditUserDialog(true);
    }

    const handleCloseAddEditUserDialog = () => {
        setIsOpenAddEditUserDialog(false);
        setSelectedUser(null);
    }

    const handleOpenPreviewUserDialog = (user) => {
        setIsOpenPreviewUserDialog(true);
        setSelectedUser(user);
    }

    const handleClosePreviewUserDialog = () => {
        setIsOpenPreviewUserDialog(false);
    }

    const handleOpenEdit = (user) => {
        setIsOpenAddEditUserDialog(true);
        setSelectedUser(user);
    }

    const handleOpenRequestsDialog = () => {
        setIsOpenRequestsDialog(true);
    }

    const handleCloseRequestsDialog = () => {
        setIsOpenRequestsDialog(false);
    }

    const handleAddDone = (addedUser) => {
        const list = [].concat(approvedUsers);
        list.push(addedUser);
        setApprovedUsers(list);
        setIsOpenAddEditUserDialog(false);
        dispatch(showMessage({ message: 'Created Successfully', variant: 'success' }));
    }

    const handleUpdateDone = (user) => {
        const list = [].concat(approvedUsers);
        const removeIndex = list.map(item => item.id).indexOf(user.id);
        list.splice(removeIndex, 1, user);
        setApprovedUsers(list);
        setIsOpenAddEditUserDialog(false);
        dispatch(showMessage({ message: 'Updated Successfully', variant: 'success' }));
    }

    const handleOpenDeleteConfirmation = (user, setSelectedRows) => {
        setSelectedUser(user);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedUser(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        UserService.delete(selectedUser.id).then(({ data }) => {
            if (data) {
                const list = [].concat(approvedUsers);
                const removeIndex = list.map(item => item.id).indexOf(selectedUser.id);
                list.splice(removeIndex, 1);
                setApprovedUsers(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                dispatch(showMessage({ message: 'Deleted Successfully', variant: 'success' }));
            }
        });
    }

    const handleChangeUserActivation = (row) => {
        const index = row.tableState.page * row.tableState.rowsPerPage + row.rowIndex;
        let user = approvedUsers[index];
        console.log(user)
        if (user.active) {
            UserService.deactivateUser(user.id).then(response => {
                console.log(response)
                user.active = response.data.active
                let list = [].concat(approvedUsers);
                list[index] = user;
                setApprovedUsers(list)
            })
        } else {
            UserService.activateUser(user.id).then(({ data }) => {
                user.active = data.active
                let list = [].concat(approvedUsers);
                list[index] = user;
                setApprovedUsers(list)
            })
        }
    }

    const fetchUserRequests = () => {
        UserService.getUserByApprovalState(false).then(({ data }) => {
            setUserRequests(data);
        })
    }

    const fetchApprovedUsers = () => {
        UserService.getUserByApprovalState(true).then(({ data }) => {
            setApprovedUsers(data);
            console.log(data)
        })
    }

    useEffect(() => {
        fetchApprovedUsers()
        fetchUserRequests();
    }, [])

    return (
        <div className="p-24 w-full">
            <InformationDialog
                open={isOpenConfirmationDialog}
                variant="warning"
                content={tGeneral("delete_record_confirmation")}
                handleConfirm={handleDelete}
                handleClose={handleCloseDeleteConfirmation}
            />
            <AddEditUserDialog
                open={isOpenAddEditUserDialog}
                handleClose={handleCloseAddEditUserDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedUser={selectedUser}
            />
            <PreviewUserDialog
                open={isOpenPreviewUserDialog}
                handleClose={handleClosePreviewUserDialog}
                selectedUser={selectedUser}
            />
            <UserRequestsDialog
                open={isOpenRequestsDialog}
                handleClose={handleCloseRequestsDialog}
                userRequests={userRequests}
                fetchUserRequests={fetchUserRequests}
                fetchApprovedUsers={fetchApprovedUsers}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tUser('TITLE')} desc={tUser('DESC')} icon="heroicons-solid:user-group">
                    <div className="w-full py-10 flex justify-end">
                        <Badge
                            badgeContent={userRequests.length}
                            color="secondary"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="secondary"
                                aria-label="New Requests"
                                size="large"
                                disabled={userRequests.length === 0}
                                onClick={handleOpenRequestsDialog}
                            >
                                {tUser('new_requests')}
                            </Button>
                        </Badge>
                    </div>
                    <GeneralTable
                        data={approvedUsers}
                        columns={renderColumns()}
                        title={tUser('TITLE')}
                        addButtonVisibility={false}
                        editButtonVisibility={ability.can("EDIT", "USER")}
                        deleteButtonVisibility={ability.can("DELETE", "USER")}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewUserDialog}
                    />
                </PaperBlock>

            </Paper>
        </div>
    )
}

export default UserMainPage;