import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditRoleDialog from "./AddEditRoleDialog";
import { useContext, useEffect, useState } from "react";
import RoleService from "src/app/services/RoleService";
import { Avatar, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import { AbilityContext } from "src/app/auth/Can";

let setSelectedRowsFunc = null;

function RoleMainPage(props) {
    const tRole = useTranslation('rolesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditRoleDialog, setIsOpenAddEditRoleDialog] = useState(false);
    const [infoDialogParam, setInfoDialogParam] = useState({
        open: false,
        variant: "warning",
        content: "",
        handleConfirm: () => { },
        handleClose: () => { }
    });
    const [allRoles, setAllRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const dispatch = useDispatch();
    const ability = useContext(AbilityContext);


    const renderColumns = () => {
        return [
            {
                label: tGeneral('name'),
                name: 'name',
            },
            {
                label: tGeneral('code'),
                name: 'code',
            },
            {
                label: tGeneral('description'),
                name: 'description',
                options: {
                    filter: false,
                }
            }
        ]
    }

    const handleOpenAddEditRoleDialog = () => {
        setIsOpenAddEditRoleDialog(true);
    }

    const handleCloseAddEditRoleDialog = () => {
        setIsOpenAddEditRoleDialog(false);
        setSelectedRole(null);
    }

    const handleOpenEdit = (role) => {
        setIsOpenAddEditRoleDialog(true);
        setSelectedRole(role);
    }

    const handleShowNotification = (message, variant) => {
        dispatch(showMessage({ message, variant }));
    }

    const handleAddDone = (addedRole) => {
        const list = [].concat(allRoles);
        list.push(addedRole);
        setAllRoles(list);
        setIsOpenAddEditRoleDialog(false);
        handleShowNotification('Created Successfully', 'success');
    }

    const handleUpdateDone = (role) => {
        const list = [].concat(allRoles);
        const removeIndex = list.map(item => item.id).indexOf(role.id);
        list.splice(removeIndex, 1, role);
        setAllRoles(list);
        setIsOpenAddEditRoleDialog(false);
        handleShowNotification('Updated Successfully', 'success');
    }

    const handleDeleteClick = (role, setSelectedRows) => {
        RoleService.verifyRoleNotRelated(role.id).then(response => {
            console.log(response);
            const notRelated = response.data;
            setSelectedRole(role);
            setSelectedRowsFunc = setSelectedRows;
            setInfoDialogParam({
                open: true,
                variant: notRelated ? "warning" : "error",
                content: notRelated ? tGeneral("delete_record_confirmation") : tRole("role_related_error"),
                handleConfirm: notRelated ? handleDelete : null,
                handleClose: handleCloseDeleteConfirmation
            })
        })
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedRole(null);
        setInfoDialogParam({
            open: false,
            variant: "warning",
            content: "",
            handleConfirm: () => { },
            handleClose: () => { }
        })
    }

    const handleDelete = () => {
        RoleService.delete(selectedRole.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allRoles);
                const removeIndex = list.map(item => item.id).indexOf(selectedRole.id);
                list.splice(removeIndex, 1);
                setAllRoles(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                dispatch(showMessage({ message: 'Deleted Successfully', variant: 'success' }));
            }
        });
    }

    const handleOpenImageViewer = (image) => {
        setCurrentImage(image);
        setIsViewerOpen(true);
    };

    const handleCloseImageViewer = () => {
        setIsViewerOpen(false);
        setTimeout(() => {
            setCurrentImage(0);
        }, 500)

    };

    useEffect(() => {
        RoleService.getAll().then(({ data }) => {
            setAllRoles(data);
        })
    }, [])

    return (
        <div className="p-24 w-full">
            <InformationDialog {...infoDialogParam} />
            <AddEditRoleDialog
                open={isOpenAddEditRoleDialog}
                handleClose={handleCloseAddEditRoleDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedRole={selectedRole}
                handleShowNotification={handleShowNotification}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tRole('TITLE')} desc={tRole('DESC')} icon="heroicons-outline:view-boards">
                    <GeneralTable
                        data={allRoles}
                        columns={renderColumns()}
                        title={tRole('TITLE')}
                        addButtonVisibility={ability.can("ADD", "ROLE")}
                        editButtonVisibility={ability.can("EDIT", "ROLE")}
                        deleteButtonVisibility={ability.can("DELETE", "ROLE")}
                        previewButtonVisibility={false}
                        handleAddClick={handleOpenAddEditRoleDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleDeleteClick}
                    />
                </PaperBlock>
            </Paper>
            <ImageViewer open={isViewerOpen} handleClose={handleCloseImageViewer} image={currentImage} />
        </div>
    )
}

export default RoleMainPage;