import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditOrderDialog from "./AddEditOrderDialog";
import { useEffect, useState } from "react";
import OrderService from "src/app/services/OrderService";
import { Avatar, IconButton, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewOrderDialog from "./PreviewOrderDialog";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import ProductsGallery from "app/theme-layouts/shared-components/ProductsGallery/ProductsGallery";

let setSelectedRowsFunc = null;

function OrderMainPage(props) {
    const tOrder = useTranslation('ordersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddOrderDialog, setIsOpenAddOrderDialog] = useState(false);
    const [isOpenEditOrderDialog, setIsOpenEditOrderDialog] = useState(false);
    const [isOpenPreviewOrderDialog, setIsOpenPreviewOrderDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
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
                label: tOrder('registered_date'),
                name: 'registeredDate',
            },
            {
                label: tOrder('confirmed_date'),
                name: 'confirmedDate',
            },
            {
                label: tOrder('shipped_date'),
                name: 'ShippedDate',
            },
            {
                label: tOrder('delivered_date'),
                name: 'deliveredDate',
            },
            {
                label: tOrder('canceled_date'),
                name: 'canceledDate',
            },
            {
                label: tOrder('state'),
                name: 'state',
            },
            {
                label: `${tOrder('total_amount')} (MAD)`,
                name: 'totalAmount',
            },
            {
                label: tOrder('reduction'),
                name: 'reduction',
            },
            {
                label: tOrder('products'),
                name: 'orderProducts',
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

    const handleOpenAddOrderDialog = () => {
        setIsOpenAddOrderDialog(true);
    }

    const handleCloseAddOrderDialog = () => {
        setIsOpenAddOrderDialog(false);
        setSelectedOrder(null);
    }

    const handleOpenEditOrderDialog = () => {
        setIsOpenEditOrderDialog(true);
    }

    const handleCloseEditOrderDialog = () => {
        setIsOpenEditOrderDialog(false);
        setSelectedOrder(null);
    }

    const handleOpenPreviewOrderDialog = (order) => {
        setIsOpenPreviewOrderDialog(true);
        setSelectedOrder(order);
    }

    const handleClosePreviewOrderDialog = () => {
        setIsOpenPreviewOrderDialog(false);
    }

    const handleOpenEdit = (order) => {
        setIsOpenEditOrderDialog(true);
        setSelectedOrder(order);
    }

    const handleShowNotification = (message, variant) => {
        dispatch(showMessage({ message, variant }));
    }

    const handleAddDone = (addedOrder) => {
        const list = [].concat(allOrders);
        list.push(addedOrder);
        setAllOrders(list);
        setIsOpenAddOrderDialog(false);
        handleShowNotification('Created Successfully', 'success');
    }

    const handleUpdateDone = (order) => {
        const list = [].concat(allOrders);
        const removeIndex = list.map(item => item.id).indexOf(order.id);
        list.splice(removeIndex, 1, order);
        setAllOrders(list);
        setIsOpenEditOrderDialog(false);
        handleShowNotification('Updated Successfully', 'success');
    }

    const handleOpenDeleteConfirmation = (order, setSelectedRows) => {
        setSelectedOrder(order);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedOrder(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        OrderService.delete(selectedOrder.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allOrders);
                const removeIndex = list.map(item => item.id).indexOf(selectedOrder.id);
                list.splice(removeIndex, 1);
                setAllOrders(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                dispatch(showMessage({ message: 'Deleted Successfully', variant: 'success' }));
            }
        });
    }

    useEffect(() => {
        OrderService.getAll().then(({ data }) => {
            setAllOrders(data);
        })
    }, [])

    return (
        <div className="p-24 w-full">
            <ProductsGallery
                handleClose={handleCloseProductsGallery}
                open={openProductsGallery}
                data={viewProductsList?.map(orderProduct => orderProduct.product)}
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
            <AddEditOrderDialog
                open={isOpenAddOrderDialog || isOpenEditOrderDialog}
                handleClose={handleCloseAddEditOrderDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedOrder={selectedOrder}
                handleShowNotification={handleShowNotification}
                isEdit
            />
            <PreviewOrderDialog
                open={isOpenPreviewOrderDialog}
                handleClose={handleClosePreviewOrderDialog}
                selectedOrder={selectedOrder}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tOrder('TITLE')} desc={tOrder('DESC')} icon="heroicons-outline:view-boards">
                    <GeneralTable
                        data={allOrders}
                        columns={renderColumns()}
                        title={tOrder('TITLE')}
                        handleAddClick={handleOpenAddEditOrderDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewOrderDialog}
                    />
                </PaperBlock>
            </Paper>
        </div>
    )
}

export default OrderMainPage;