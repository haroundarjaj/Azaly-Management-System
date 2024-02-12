import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditClientDialog from "./AddEditClientDialog";
import { useEffect, useState, useContext } from "react";
import ClientService from "src/app/services/ClientService";
import { Avatar, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewClientDialog from "./PreviewClientDialog";
import { AbilityContext } from "src/app/auth/Can";
import { catchServerError, showNotification } from "src/app/utils/NotificationTools";

let setSelectedRowsFunc = null;

function ClientMainPage(props) {
    const tClient = useTranslation('clientsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditClientDialog, setIsOpenAddEditClientDialog] = useState(false);
    const [isOpenPreviewClientDialog, setIsOpenPreviewClientDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [allClients, setAllClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

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
                label: tClient('individual'),
                name: 'isIndividual',
                options: {
                    display: false
                }
            }
        ]
    }

    const handleOpenAddEditClientDialog = () => {
        setIsOpenAddEditClientDialog(true);
    }

    const handleCloseAddEditClientDialog = () => {
        setIsOpenAddEditClientDialog(false);
        setSelectedClient(null);
    }

    const handleOpenPreviewClientDialog = (client) => {
        setIsOpenPreviewClientDialog(true);
        setSelectedClient(client);
    }

    const handleClosePreviewClientDialog = () => {
        setIsOpenPreviewClientDialog(false);
    }

    const handleOpenEdit = (client) => {
        setIsOpenAddEditClientDialog(true);
        setSelectedClient(client);
    }

    const handleAddDone = (addedClient) => {
        const list = [].concat(allClients);
        list.push(addedClient);
        setAllClients(list);
        setIsOpenAddEditClientDialog(false);
        showNotification(dispatch, tGeneral('created_successfully'), 'success');
    }

    const handleUpdateDone = (client) => {
        const list = [].concat(allClients);
        const removeIndex = list.map(item => item.id).indexOf(client.id);
        list.splice(removeIndex, 1, client);
        setAllClients(list);
        setIsOpenAddEditClientDialog(false);
        showNotification(dispatch, tGeneral('updated_successfully'), 'success');
    }

    const handleOpenDeleteConfirmation = (client, setSelectedRows) => {
        setSelectedClient(client);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedClient(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        ClientService.delete(selectedClient.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allClients);
                const removeIndex = list.map(item => item.id).indexOf(selectedClient.id);
                list.splice(removeIndex, 1);
                setAllClients(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                showNotification(dispatch, tGeneral('deleted_successfully'), 'success');
            }
        }).catch(err => catchServerError(dispatch, tGeneral, err));
    }

    useEffect(() => {
        ClientService.getAll().then(({ data }) => {
            setAllClients(data);
            setIsLoadingData(false);
        })
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
            <AddEditClientDialog
                open={isOpenAddEditClientDialog}
                handleClose={handleCloseAddEditClientDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedClient={selectedClient}
            />
            <PreviewClientDialog
                open={isOpenPreviewClientDialog}
                handleClose={handleClosePreviewClientDialog}
                selectedClient={selectedClient}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tClient('TITLE')} desc={tClient('DESC')} icon="heroicons-solid:user-group">
                    <GeneralTable
                        data={allClients}
                        columns={renderColumns()}
                        title={tClient('TITLE')}
                        loading={isLoadingData}
                        addButtonVisibility={ability.can("ADD", "CLIENT")}
                        editButtonVisibility={ability.can("EDIT", "CLIENT")}
                        deleteButtonVisibility={ability.can("DELETE", "CLIENT")}
                        handleAddClick={handleOpenAddEditClientDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewClientDialog}
                    />
                </PaperBlock>

            </Paper>
        </div>
    )
}

export default ClientMainPage;