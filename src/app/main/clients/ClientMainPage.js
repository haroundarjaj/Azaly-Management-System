import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import PapperBlock from "app/theme-layouts/shared-components/PapperBlock/PapperBlock";
import { useTranslation } from 'react-i18next';
import AddEditClientDialog from "./AddEditClientDialog";
import { useEffect, useState } from "react";
import ClientService from "src/app/services/ClientService";
import { Avatar } from "@mui/material";

function ClientMainPage(props) {
    const { t } = useTranslation('clientsPage');

    const [isOpenAddEditClientDialog, setIsOpenAddEditClientDialog] = useState(false);
    const [allClients, setAllClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    console.log(`${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`)
    const renderColumns = () => {
        return [
            {
                name: 'image',
                label: 'Image',
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, row) => (
                        <Avatar
                            alt={t('user.image.profilePicture')}
                            src={value || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                            style={{ width: 60, height: 60 }}
                        />
                    )

                }
            },
            {
                label: 'First name',
                name: 'firstName',
            },
            {
                label: 'Last name',
                name: 'lastName',
            },
            {
                label: 'Phone number',
                name: 'phoneNumber',
            },
            {
                label: 'Email',
                name: 'email',
            },
            {
                label: 'Address',
                name: 'address',
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

    const handleOpenEdit = (client) => {
        setIsOpenAddEditClientDialog(true);
        setSelectedClient(client);
    }

    const handleAddDone = (addedClient) => {
        const list = [].concat(allClients);
        list.unshift(addedClient);
        console.log(list);
        setAllClients(list);
        setIsOpenAddEditClientDialog(false);
    }

    const handleUpdateDone = (client) => {
        const list = [].concat(allClients);
        const removeIndex = list.map(item => item.id).indexOf(client.id);
        list.splice(removeIndex, 1, client);
        setAllClients(list);
        setIsOpenAddEditClientDialog(false);
    }

    const handleDelete = (client, setSelectedRows) => {
        ClientService.delete(client.id).then(({ data }) => {
            if (data) {
                setSelectedRows([])
                const list = [].concat(allClients);
                const removeIndex = list.map(item => item.id).indexOf(client.id);
                list.splice(removeIndex, 1);
                setAllClients(list);
            }
        });
    }

    useEffect(() => {
        ClientService.getAll().then(({ data }) => {
            setAllClients(data);
            console.log(data);
        })
    }, [])

    useEffect(() => {
        console.log("check selected client", selectedClient)
    }, [selectedClient])

    console.log(allClients);
    return (
        <div className="p-24 w-full">
            <AddEditClientDialog
                open={isOpenAddEditClientDialog}
                handleClose={handleCloseAddEditClientDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedClient={selectedClient}
            />
            <PapperBlock title={t('TITLE')} desc={t('DESC')} icon="heroicons-outline:user-group" noMargin overflowX>
                <GeneralTable
                    title={t('table_title')}
                    data={allClients}
                    columns={renderColumns()}
                    handleAddClick={handleOpenAddEditClientDialog}
                    handleEditClick={handleOpenEdit}
                    handleDeleteClick={handleDelete}
                />
            </PapperBlock>
        </div>
    )
}

export default ClientMainPage;