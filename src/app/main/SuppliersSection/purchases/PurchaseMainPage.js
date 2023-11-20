import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditPurchaseDialog from "./AddEditPurchaseDialog";
import { useEffect, useState } from "react";
import PurchaseService from "src/app/services/PurchaseService";
import { IconButton, Paper, Typography } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewPurchaseDialog from "./PreviewPurchaseDialog";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import ProductsGallery from "app/theme-layouts/shared-components/ProductsGallery/ProductsGallery";
import GeneratePurchaseStates from "./GeneratePurchaseStates";
import { Box } from "@mui/system";
import PurchaseStateDialog from "./PurchaseStateDialog";

let setSelectedRowsFunc = null;

function PurchaseMainPage(props) {
    const tPurchase = useTranslation('purchasesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditPurchaseDialog, setIsOpenAddEditPurchaseDialog] = useState(false);
    const [isOpenPreviewPurchaseDialog, setIsOpenPreviewPurchaseDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [isOpenPurchaseStateDialog, setIsOpenPurchaseStateDialog] = useState(false);
    const [allPurchases, setAllPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [openProductsGallery, setOpenProductsGallery] = useState(false);
    const [viewProductsList, setViewProductsList] = useState(null);
    const [index, setIndex] = useState(0);

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
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, tableMeta) => renderStateElement(value, tableMeta)

                }

            },
            {
                label: tPurchase('state'),
                name: 'state',
                options: {
                    display: false,
                    viewColumns: false
                }

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

    const renderStateElement = (value, tableMeta) => {
        const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
        setIndex(index)
        const result = GeneratePurchaseStates(tGeneral).filter(state => state.value === value)[0];
        return (
            <Box onClick={() => handleOpenPurchaseStateDialog(allPurchases[index])} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} style={{ cursor: 'pointer' }}>
                {result.icon}
                {result.name}
            </Box>
        )
    }

    const handleOpenProductsGallery = (productsList) => {
        console.log(productsList)
        setOpenProductsGallery(true);
        setViewProductsList(productsList)
    }

    const handleCloseProductsGallery = () => {
        setOpenProductsGallery(false);
    }

    const handleOpenAddEditPurchaseDialog = () => {
        setIsOpenAddEditPurchaseDialog(true);
    }

    const handleCloseAddEditPurchaseDialog = () => {
        setIsOpenAddEditPurchaseDialog(false);
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
        setIsOpenAddEditPurchaseDialog(true);
        setSelectedPurchase(purchase);
    }

    const handleShowNotification = (message, variant) => {
        dispatch(showMessage({ message, variant }));
    }

    const handleAddDone = (addedPurchase) => {
        const list = [].concat(allPurchases);
        list.push(addedPurchase);
        setAllPurchases(list);
        setIsOpenAddEditPurchaseDialog(false);
        handleShowNotification('Created Successfully', 'success');
    }

    const handleUpdateDone = (purchase) => {
        const list = [].concat(allPurchases);
        const removeIndex = list.map(item => item.id).indexOf(purchase.id);
        list.splice(removeIndex, 1, purchase);
        setAllPurchases(list);
        setIsOpenAddEditPurchaseDialog(false);
        handleShowNotification('Updated Successfully', 'success');
    }

    const handleOpenDeleteConfirmation = (purchase, setSelectedRows) => {
        setSelectedPurchase(purchase);
        setIsOpenConfirmationDialog(true);
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedPurchase(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleOpenPurchaseStateDialog = (purchase) => {
        setSelectedPurchase(purchase);
        setIsOpenPurchaseStateDialog(true);
    }

    const handleClosePurchaseStateDialog = () => {
        setIsOpenPurchaseStateDialog(false);
        setSelectedPurchase(null);
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

    const handleSaveStateUpdate = (state, purchaseId) => {
        PurchaseService.updateState(state, purchaseId)
            .then((response) => {
                const data = allPurchases;
                data[index].state = state;
                setAllPurchases(data)
            })
    }

    useEffect(() => {
        PurchaseService.getAll().then(({ data }) => {
            setAllPurchases(data);
        })
    }, [])

    return (
        <div className="p-24 w-full">
            <PurchaseStateDialog
                open={isOpenPurchaseStateDialog}
                handleClose={handleClosePurchaseStateDialog}
                purchase={selectedPurchase}
                handleSave={handleSaveStateUpdate}
            />
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
                open={isOpenAddEditPurchaseDialog}
                handleClose={handleCloseAddEditPurchaseDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedPurchase={selectedPurchase}
                handleShowNotification={handleShowNotification}
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