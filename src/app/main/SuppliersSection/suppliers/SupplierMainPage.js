import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditSupplierDialog from "./AddEditSupplierDialog";
import { useEffect, useState } from "react";
import SupplierService from "src/app/services/SupplierService";
import { Avatar, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewSupplierDialog from "./PreviewSupplierDialog";

let setSelectedRowsFunc = null;

function SupplierMainPage(props) {
    const tSupplier = useTranslation('suppliersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditSupplierDialog, setIsOpenAddEditSupplierDialog] = useState(false);
    const [isOpenPreviewSupplierDialog, setIsOpenPreviewSupplierDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allSuppliers, setAllSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const dispatch = useDispatch();


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
                label: tSupplier('individual'),
                name: 'isIndividual',
                options: {
                    display: false
                }
            }
        ]
    }

    const handleOpenAddEditSupplierDialog = () => {
        setIsOpenAddEditSupplierDialog(true);
    }

    const handleCloseAddEditSupplierDialog = () => {
        setIsOpenAddEditSupplierDialog(false);
        setSelectedSupplier(null);
    }

    const handleOpenPreviewSupplierDialog = (supplier) => {
        setIsOpenPreviewSupplierDialog(true);
        setSelectedSupplier(supplier);
    }

    const handleClosePreviewSupplierDialog = () => {
        setIsOpenPreviewSupplierDialog(false);
    }

    const handleOpenEdit = (supplier) => {
        setIsOpenAddEditSupplierDialog(true);
        setSelectedSupplier(supplier);
    }

    const handleAddDone = (addedSupplier) => {
        const list = [].concat(allSuppliers);
        list.push(addedSupplier);
        setAllSuppliers(list);
        setIsOpenAddEditSupplierDialog(false);
        dispatch(showMessage({ message: 'Created Successfully', variant: 'success' }));
    }

    const handleUpdateDone = (supplier) => {
        const list = [].concat(allSuppliers);
        const removeIndex = list.map(item => item.id).indexOf(supplier.id);
        list.splice(removeIndex, 1, supplier);
        setAllSuppliers(list);
        setIsOpenAddEditSupplierDialog(false);
        dispatch(showMessage({ message: 'Updated Successfully', variant: 'success' }));
    }

    const handleOpenDeleteConfirmation = (supplier, setSelectedRows) => {
        setSelectedSupplier(supplier);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedSupplier(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        SupplierService.delete(selectedSupplier.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allSuppliers);
                const removeIndex = list.map(item => item.id).indexOf(selectedSupplier.id);
                list.splice(removeIndex, 1);
                setAllSuppliers(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                dispatch(showMessage({ message: 'Deleted Successfully', variant: 'success' }));
            }
        });
    }

    useEffect(() => {
        SupplierService.getAll().then(({ data }) => {
            setAllSuppliers(data);
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
            <AddEditSupplierDialog
                open={isOpenAddEditSupplierDialog}
                handleClose={handleCloseAddEditSupplierDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedSupplier={selectedSupplier}
            />
            <PreviewSupplierDialog
                open={isOpenPreviewSupplierDialog}
                handleClose={handleClosePreviewSupplierDialog}
                selectedSupplier={selectedSupplier}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tSupplier('TITLE')} desc={tSupplier('DESC')} icon="heroicons-solid:user-group">
                    <GeneralTable
                        data={allSuppliers}
                        columns={renderColumns()}
                        title={tSupplier('TITLE')}
                        handleAddClick={handleOpenAddEditSupplierDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewSupplierDialog}
                    />
                </PaperBlock>

            </Paper>
        </div>
    )
}

export default SupplierMainPage;