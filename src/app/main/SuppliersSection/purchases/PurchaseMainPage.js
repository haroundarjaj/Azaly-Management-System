import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditPurchaseDialog from "./AddEditPurchaseDialog";
import { useContext, useEffect, useState } from "react";
import PurchaseService from "src/app/services/PurchaseService";
import { IconButton, Paper, Typography } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewPurchaseDialog from "./PreviewPurchaseDialog";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import FeedstockList from "app/theme-layouts/shared-components/FeedstockList/FeedstockList";
import { AbilityContext } from "src/app/auth/Can";

let setSelectedRowsFunc = null;

function PurchaseMainPage(props) {
    const tPurchase = useTranslation('purchasesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditPurchaseDialog, setIsOpenAddEditPurchaseDialog] = useState(false);
    const [isOpenPreviewPurchaseDialog, setIsOpenPreviewPurchaseDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allPurchases, setAllPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [openFeedstockList, setOpenFeedstockList] = useState(false);
    const [viewProductsList, setViewProductsList] = useState(null);

    const dispatch = useDispatch();
    const ability = useContext(AbilityContext);


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
                label: tGeneral('date'),
                name: 'date'
            },
            {
                label: `${tGeneral('total_amount')} (MAD)`,
                name: 'totalAmount',
            },
            {
                label: tGeneral('items'),
                name: 'purchasedFeedstock',
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, row) => (
                        <IconButton onClick={() => handleOpenFeedstockList(value)} className="mx-8" size="large">
                            <FuseSvgIcon>heroicons-solid:eye</FuseSvgIcon>
                        </IconButton>
                    )

                }
            }
        ]
    }

    const handleOpenFeedstockList = (productsList) => {
        console.log(productsList)
        setOpenFeedstockList(true);
        setViewProductsList(productsList)
    }

    const handleCloseFeedstockList = () => {
        setOpenFeedstockList(false);
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
            <FeedstockList
                handleClose={handleCloseFeedstockList}
                open={openFeedstockList}
                data={viewProductsList?.map(purchaseProduct => purchaseProduct.item)}
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
                        addButtonVisibility={ability.can("ADD", "PURCHASE")}
                        editButtonVisibility={ability.can("EDIT", "PURCHASE")}
                        deleteButtonVisibility={ability.can("DELETE", "PURCHASE")}
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