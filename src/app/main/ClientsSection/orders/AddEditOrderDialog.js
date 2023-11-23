import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Autocomplete, Popper, Box, InputAdornment } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import "profile-picture/build/ProfilePicture.css";
import OrderService from "src/app/services/OrderService";
import { useForm } from "react-hook-form";
import AutoComplete from "app/theme-layouts/shared-components/AutoComplete";
import ClientService from "src/app/services/ClientService";
import { DateTimePicker } from '@mui/x-date-pickers';
import ProductsGallery from "app/theme-layouts/shared-components/ProductsGallery/ProductsGallery";
import moment from "moment";
import GenerateOrderStates from "./GenerateOrderStates";

function AddEditOrderDialog(props) {
    const tOrder = useTranslation('ordersPage').t;
    const tProduct = useTranslation('productsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        handleShowNotification,
        open,
        selectedOrder,
    } = props;


    const { register, handleSubmit, reset, getValues } = useForm({ mode: 'onTouched' });

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [registeredDate, setRegisteredDate] = useState(new Date());
    const [confirmedDate, setConfirmedDate] = useState(null);
    const [shippedDate, setShippedDate] = useState(null);
    const [deliveredDate, setDeliveredDate] = useState(null);
    const [canceledDate, setCanceledDate] = useState(null);
    const [openProductsGallery, setOpenProductsGallery] = useState(false);
    const [productsList, setProductsList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const onClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return false;
        }

        if (reason === 'escapeKeyDown') {
            return false;
        }

        if (typeof onClose === 'function') {
            handleClose();
        }
    };

    const handleSave = (data) => {
        const order = {
            ...data,
            state: GenerateOrderStates(tOrder).filter(elem => elem.value === data.state)[0].value,
            orderProducts: productsList,
            registeredDate: registeredDate ? moment(registeredDate).format('DD/MM/YYYY HH:mm:ss') : "",
            confirmedDate: confirmedDate ? moment(confirmedDate).format('DD/MM/YYYY HH:mm:ss') : "",
            shippedDate: shippedDate ? moment(shippedDate).format('DD/MM/YYYY HH:mm:ss') : "",
            deliveredDate: deliveredDate ? moment(deliveredDate).format('DD/MM/YYYY HH:mm:ss') : "",
            canceledDate: canceledDate ? moment(canceledDate).format('DD/MM/YYYY HH:mm:ss') : "",
            clientId: selectedClient.id,
            totalAmount: totalAmount
        }
        console.log("testadd", order);
        if (selectedOrder) {
            order.id = selectedOrder.id;
            OrderService.update(order).then(({ data }) => {
                handleUpdateDone(data);
            }).catch(err => {
                console.log(err)
                if (err.response.data.cause) {
                    handleShowNotification(tOrder(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        } else {
            OrderService.add(order).then(({ data }) => {
                handleAddDone(data);
            }).catch(err => {
                console.log(err)
                if (err.response.data.cause) {
                    handleShowNotification(tOrder(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        };
    }

    const handleOpenProductsGallery = () => {
        setOpenProductsGallery(true);
    }

    const handleCloseProductsGallery = () => {
        setOpenProductsGallery(false);
    }

    const handleCountTotalAmount = (list, reductionValue) => {
        let total = 0;
        list.forEach(elem => {
            total += elem.price * elem.quantity;
        })
        console.log(reductionValue)
        if (reductionValue !== 0) {
            total = total - (total * reductionValue) / 100;
        }
        setTotalAmount(total)
    }
    const handleSaveSelectingProducts = (list) => {
        setProductsList(list);
        handleCountTotalAmount(list, getValues('reduction'));
    }

    const handleChangeReduction = (e) => {
        handleCountTotalAmount(productsList, e.target.value);
    }

    const handleChangeClient = (newValue) => {
        console.log(newValue);
        setSelectedClient(newValue)
    }

    useEffect(() => {
        if (open && selectedOrder) {
            reset(selectedOrder)
            setRegisteredDate(moment(selectedOrder.registeredDate, 'DD/MM/YYYY hh:mm:ss'))
            setConfirmedDate(selectedOrder.confirmedDate ? moment(selectedOrder.confirmedDate, 'DD/MM/YYYY hh:mm:ss') : null)
            setShippedDate(selectedOrder.shippedDate ? moment(selectedOrder.shippedDate, 'DD/MM/YYYY hh:mm:ss') : null)
            setDeliveredDate(selectedOrder.deliveredDate ? moment(selectedOrder.deliveredDate, 'DD/MM/YYYY hh:mm:ss') : null)
            setCanceledDate(selectedOrder.canceledDate ? moment(selectedOrder.canceledDate, 'DD/MM/YYYY hh:mm:ss') : null)
            setSelectedClient(clients.find(x => x.id === selectedOrder.clientId))
            setTotalAmount(selectedOrder.totalAmount)
            setProductsList(selectedOrder.orderProducts)
        } else {
            reset({
                ref: '',
                state: "registered",
                registeredDate: '',
                confirmedDate: '',
                shippedDate: '',
                deliveredDate: '',
                canceledDate: '',
            });
            setRegisteredDate(new Date())
            setConfirmedDate(null)
            setShippedDate(null)
            setDeliveredDate(null)
            setCanceledDate(null)
            setSelectedClient(null)
            setProductsList([])
            setTotalAmount(0)
        };
    }, [open])

    useEffect(() => {
        ClientService.getAll().then(({ data }) => {
            data.sort((a, b) => {
                const textA = a.firstName.toUpperCase();
                const textB = b.firstName.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
            setClients(data);
        })
    }, [])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {selectedOrder ? tOrder('edit_title') : tOrder('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedOrder ? tOrder('edit_desc') : tOrder('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>

                <form
                    id="add-order-form"
                    onSubmit={handleSubmit(handleSave)}
                >
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="ref"
                                label={tGeneral("ref")}
                                variant="outlined"
                                name="ref"
                                required
                                fullWidth
                                defaultValue={selectedOrder?.ref}
                                {...register('ref')}
                            //style={{ marginTop: 23 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AutoComplete
                                options={clients}
                                getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                fullWidth
                                value={selectedClient}
                                onChange={(e, newValue) => handleChangeClient(newValue)}
                                renderInput={(params) =>
                                    <TextField
                                        id="client"
                                        name="client"
                                        {...params}
                                        label={tGeneral("client")}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AutoComplete
                                defaultValue={selectedOrder ? { name: tOrder(selectedOrder?.state), value: selectedOrder?.state } : { name: tOrder("registered"), value: "registered" }}
                                options={GenerateOrderStates(tOrder)}
                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                fullWidth
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        {option.icon}
                                        {option.name}
                                    </Box>
                                )}
                                readOnly={!selectedOrder}
                                renderInput={(params) =>
                                    <TextField
                                        id="state"
                                        name="state"
                                        {...params}
                                        required
                                        label={tGeneral("state")}
                                        {...register('state')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={registeredDate}
                                onChange={(value) => {
                                    console.log(value)
                                    setRegisteredDate(value)
                                }}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="registeredDate"
                                        name="registeredDate"
                                        {...params}
                                        label={tOrder("registered_date")}
                                        {...register('registeredDate')}
                                        required
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={confirmedDate}
                                onChange={setConfirmedDate}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="confirmedDate"
                                        name="confirmedDate"
                                        {...params}
                                        label={tOrder("confirmed_date")}
                                        {...register('confirmedDate')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={shippedDate}
                                onChange={setShippedDate}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="shippedDate"
                                        name="shippedDate"
                                        {...params}
                                        label={tOrder("shipped_date")}
                                        {...register('shippedDate')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={deliveredDate}
                                onChange={setDeliveredDate}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="deliveredDate"
                                        name="deliveredDate"
                                        {...params}
                                        label={tOrder("delivered_date")}
                                        {...register('deliveredDate')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={canceledDate}
                                onChange={setCanceledDate}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="canceledDate"
                                        name="canceledDate"
                                        {...params}
                                        label={tOrder("canceled_date")}
                                        {...register('canceledDate')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className="flex justify-center">
                                <Button variant="contained" onClick={handleOpenProductsGallery} color="secondary">
                                    {tProduct('select_products')}
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="totalAmount"
                                label={tOrder("total_amount")}
                                variant="outlined"
                                name="totalAmount"
                                required
                                fullWidth
                                defaultValue={selectedOrder ? selectedOrder.totalAmount : 0}
                                value={totalAmount}
                                {...register('totalAmount', { valueAsNumber: true })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">MAD</InputAdornment>,
                                    readOnly: true,
                                    inputProps: { min: 0 }
                                }}
                                type="number"
                            //style={{ marginTop: 23 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="reduction"
                                label={tOrder("reduction")}
                                variant="outlined"
                                name="reduction"
                                fullWidth
                                defaultValue={selectedOrder ? selectedOrder.reduction : 0}
                                {...register('reduction', { valueAsNumber: true })}
                                type="number"
                                onChange={handleChangeReduction}
                                InputProps={{
                                    inputProps: { min: 0 },
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                                }}
                            //style={{ marginTop: 23 }}
                            />
                        </Grid>
                    </Grid>
                </form>
                <ProductsGallery
                    handleClose={handleCloseProductsGallery}
                    open={openProductsGallery}
                    handleSave={handleSaveSelectingProducts}
                    selectedElements={productsList}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                <Button color="secondary" type="submit" form="add-order-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditOrderDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedOrder: PropTypes.object,
}

AddEditOrderDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedOrder: null,
}

export default AddEditOrderDialog;