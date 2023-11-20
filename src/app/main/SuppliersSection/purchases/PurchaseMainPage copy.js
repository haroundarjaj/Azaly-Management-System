import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditPurchaseDialog from "./AddEditPurchaseDialog";
import { useEffect, useState } from "react";
import PurchaseService from "src/app/services/PurchaseService";
import { Avatar, IconButton, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewPurchaseDialog from "./PreviewPurchaseDialog";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import ProductsGallery from "app/theme-layouts/shared-components/ProductsGallery/ProductsGallery";

let setSelectedRowsFunc = null;

function PurchaseMainPage(props) {
    const tPurchase = useTranslation('purchasesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddPurchaseDialog, setIsOpenAddPurchaseDialog] = useState(false);
    const [isOpenEditPurchaseDialog, setIsOpenEditPurchaseDialog] = useState(false);
    const [isOpenPreviewPurchaseDialog, setIsOpenPreviewPurchaseDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allPurchases, setAllPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [openProductsGallery, setOpenProductsGallery] = useState(false);
    const [viewProductsList, setViewProductsList] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const dispatch = useDispatch();


    const renderColumns = () => {
        return [
            {
                label: tGeneral('ref'),
                name: 'ref',
                options: {
                    filter: false,
                }
            },
            {
                label: tPurchase('purchase_date'),
                name: 'purchaseDate',
            },
            {
                label: tPurchase('delivery_date'),
                name: 'deliveryDate',
            },
            {
                label: tPurchase('reception_date'),
                name: 'receptionDate',
            },
            {
                label: tPurchase('state'),
                name: 'state',
            },
            {
                label: tPurchase('total_amount'),
                name: 'totalAmount',
            },
            {
                label: tPurchase('reduction'),
                name: 'reduction',
            },
            {
                label: tPurchase('products'),
                name: 'purchaseProducts',
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, row) => (
                        <IconButton onClick={() => handleOpenProductsGallery(value)} className="mx-8" size="large">
                            <FuseSvgIcon>heroicons-solid:eye</FuseSvgIcon>
                        </IconButton>
                    )

                }
            }
        ]
    }

    const handleOpenProductsGallery = (productsList) => {
        console.log(productsList)
        setOpenProductsGallery(true);
        setViewProductsList(productsList)
    }

    const handleCloseProductsGallery = () => {
        setOpenProductsGallery(false);
    }

    const handleOpenAddPurchaseDialog = () => {
        setIsOpenAddPurchaseDialog(true);
    }

    const handleCloseAddPurchaseDialog = () => {
        setIsOpenAddPurchaseDialog(false);
        setSelectedPurchase(null);
    }

    const handleOpenEditPurchaseDialog = () => {
        setIsOpenEditPurchaseDialog(true);
    }

    const handleCloseEditPurchaseDialog = () => {
        setIsOpenEditPurchaseDialog(false);
        setSelectedPurchase(null);
    }

    const handleOpenPreviewPurchaseDialog = (purchase) => {
        setIsOpenPreviewPurchaseDialog(true);
        setSelectedPurchase(purchase);
    }

    const handleClosePreviewPurchaseDialog = () => {
        setIsOpenPreviewPurchaseDialog(false);
    }

    const handleOpenEdit = (purchase) => {
        setIsOpenEditPurchaseDialog(true);
        setSelectedPurchase(purchase);
    }

    const handleShowNotification = (message, variant) => {
        dispatch(showMessage({ message, variant }));
    }

    const handleAddDone = (addedPurchase) => {
        const list = [].concat(allPurchases);
        list.push(addedPurchase);
        setAllPurchases(list);
        setIsOpenAddPurchaseDialog(false);
        handleShowNotification('Created Successfully', 'success');
    }

    const handleUpdateDone = (purchase) => {
        const list = [].concat(allPurchases);
        const removeIndex = list.map(item => item.id).indexOf(purchase.id);
        list.splice(removeIndex, 1, purchase);
        setAllPurchases(list);
        setIsOpenEditPurchaseDialog(false);
        handleShowNotification('Updated Successfully', 'success');
    }

    const handleOpenDeleteConfirmation = (purchase, setSelectedRows) => {
        setSelectedPurchase(purchase);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedPurchase(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        PurchaseService.delete(selectedPurchase.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allPurchases);
                const removeIndex = list.map(item => item.id).indexOf(selectedPurchase.id);
                list.splice(removeIndex, 1);
                setAllPurchases(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                dispatch(showMessage({ message: 'Deleted Successfully', variant: 'success' }));
            }
        });
    }

    useEffect(() => {
        PurchaseService.getAll().then(({ data }) => {
            setAllPurchases(data);
        })
    }, [])

    return (
        <div className="p-24 w-full">
            <ProductsGallery
                handleClose={handleCloseProductsGallery}
                open={openProductsGallery}
                data={viewProductsList?.map(purchaseProduct => purchaseProduct.product)}
                selectedElements={viewProductsList}
                preview
            />
            <InformationDialog
                open={isOpenConfirmationDialog}
                variant="warning"
                content={tGeneral("delete_record_confirmation")}
                handleConfirm={handleDelete}
                handleClose={handleCloseDeleteConfirmation}
            />
            <AddEditPurchaseDialog
                open={isOpenAddPurchaseDialog || isOpenEditPurchaseDialog}
                handleClose={handleCloseAddEditPurchaseDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedPurchase={selectedPurchase}
                handleShowNotification={handleShowNotification}
                isEdit
            />
            <PreviewPurchaseDialog
                open={isOpenPreviewPurchaseDialog}
                handleClose={handleClosePreviewPurchaseDialog}
                selectedPurchase={selectedPurchase}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tPurchase('TITLE')} desc={tPurchase('DESC')} icon="heroicons-outline:view-boards">
                    <GeneralTable
                        data={allPurchases}
                        columns={renderColumns()}
                        title={tPurchase('TITLE')}
                        handleAddClick={handleOpenAddEditPurchaseDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewPurchaseDialog}
                    />
                </PaperBlock>
            </Paper>
        </div>
    )
}

export default PurchaseMainPage;