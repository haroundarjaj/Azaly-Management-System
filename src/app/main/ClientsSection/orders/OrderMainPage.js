import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditOrderDialog from "./AddEditOrderDialog";
import { useEffect, useState } from "react";
import OrderService from "src/app/services/OrderService";
import { IconButton, Paper, Typography } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewOrderDialog from "./PreviewOrderDialog";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import ProductsGallery from "app/theme-layouts/shared-components/ProductsGallery/ProductsGallery";
import GenerateOrderStates from "./GenerateOrderStates";
import { Box } from "@mui/system";
import OrderStateDialog from "./OrderStateDialog";
import OrderTimeline from "./OrderTimeline";

let setSelectedRowsFunc = null;

function OrderMainPage(props) {
    const tOrder = useTranslation('ordersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditOrderDialog, setIsOpenAddEditOrderDialog] = useState(false);
    const [isOpenPreviewOrderDialog, setIsOpenPreviewOrderDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [isOpenOrderStateDialog, setIsOpenOrderStateDialog] = useState(false);
    const [isOpenOrderTimelineDialog, setIsOpenOrderTimelineDialog] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
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
                label: tGeneral('state'),
                name: 'state',
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, tableMeta) => renderOrderTimeline(value, tableMeta)

                }

            },
            {
                label: tGeneral('state'),
                name: 'state',
                options: {
                    display: false,
                    viewColumns: false
                }

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

    const renderOrderTimeline = (value, tableMeta) => {
        const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
        setIndex(index)
        const result = GenerateOrderStates(tOrder).filter(state => state.value === value)[0];
        console.log(value)
        console.log(result)
        return (
            <Box onClick={() => handleOpenOrderTimelineDialog(allOrders[index])} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} style={{ cursor: 'pointer' }}>
                {result?.icon}
                {result?.name}
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

    const handleOpenAddEditOrderDialog = () => {
        setIsOpenAddEditOrderDialog(true);
    }

    const handleCloseAddEditOrderDialog = () => {
        setIsOpenAddEditOrderDialog(false);
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
        setIsOpenAddEditOrderDialog(true);
        setSelectedOrder(order);
    }

    const handleShowNotification = (message, variant) => {
        dispatch(showMessage({ message, variant }));
    }

    const handleAddDone = (addedOrder) => {
        const list = [].concat(allOrders);
        list.push(addedOrder);
        setAllOrders(list);
        setIsOpenAddEditOrderDialog(false);
        handleShowNotification('Created Successfully', 'success');
    }

    const handleUpdateDone = (order) => {
        const list = [].concat(allOrders);
        const removeIndex = list.map(item => item.id).indexOf(order.id);
        list.splice(removeIndex, 1, order);
        setAllOrders(list);
        setIsOpenAddEditOrderDialog(false);
        handleShowNotification('Updated Successfully', 'success');
    }

    const handleOpenDeleteConfirmation = (order, setSelectedRows) => {
        setSelectedOrder(order);
        setSelectedRowsFunc = setSelectedRows;
        setIsOpenConfirmationDialog(true);
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedOrder(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleOpenOrderStateDialog = (order) => {
        setSelectedOrder(order);
        setIsOpenOrderStateDialog(true);
    }

    const handleOpenOrderTimelineDialog = (order) => {
        setSelectedOrder(order);
        setIsOpenOrderTimelineDialog(true);
    }

    const handleCloseOrderStateDialog = () => {
        setIsOpenOrderStateDialog(false);
        setSelectedOrder(null);
    }

    const handleCloseOrderTimelineDialog = () => {
        setIsOpenOrderTimelineDialog(false);
        setSelectedOrder(null);
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

    const handleSaveStateUpdate = (state, orderId) => {
        OrderService.updateState(state, orderId)
            .then((response) => {
                const data = allOrders;
                data[index].state = state;
                setAllOrders(data)
            })
    }

    useEffect(() => {
        OrderService.getAll().then(({ data }) => {
            setAllOrders(data);
        })
    }, [])

    return (
        <div className="p-24 w-full">
            <OrderStateDialog
                open={isOpenOrderStateDialog}
                handleClose={handleCloseOrderStateDialog}
                order={selectedOrder}
                handleSave={handleSaveStateUpdate}
            />
            <OrderTimeline
                open={isOpenOrderTimelineDialog}
                handleClose={handleCloseOrderTimelineDialog}
                order={selectedOrder}
            />
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
                open={isOpenAddEditOrderDialog}
                handleClose={handleCloseAddEditOrderDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedOrder={selectedOrder}
                handleShowNotification={handleShowNotification}
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