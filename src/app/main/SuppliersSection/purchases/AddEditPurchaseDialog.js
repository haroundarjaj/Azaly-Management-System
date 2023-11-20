import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Autocomplete, Popper, Box, InputAdornment } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import "profile-picture/build/ProfilePicture.css";
import PurchaseService from "src/app/services/PurchaseService";
import { useForm } from "react-hook-form";
import AutoComplete from "app/theme-layouts/shared-components/AutoComplete";
import { SaveAs, ThumbUpAlt, DeliveryDining, CheckCircle, Cancel } from '@mui/icons-material';
import ClientService from "src/app/services/ClientService";
import { DateTimePicker } from '@mui/x-date-pickers';
import ProductsGallery from "app/theme-layouts/shared-components/ProductsGallery/ProductsGallery";
import moment from "moment";
import GeneratePurchaseStates from "./GeneratePurchaseStates";

function AddEditPurchaseDialog(props) {
    const tPurchase = useTranslation('purchasesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        handleShowNotification,
        open,
        selectedPurchase,
    } = props;


    const { register, handleSubmit, reset, getValues } = useForm({ mode: 'onTouched' });

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [purchaseDate, setPurchaseDate] = useState(new Date());
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [receptionDate, setReceptionDate] = useState(null);
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
        console.log(purchaseDate.toLocaleString())
        console.log(purchaseDate.toISOString())
        console.log(purchaseDate.format('DD/MM/YYYY HH:mm:ss'))
        const purchase = {
            ...data,
            purchaseProducts: productsList,
            purchaseDate: purchaseDate?.format('DD/MM/YYYY HH:mm:ss'),
            deliveryDate: deliveryDate?.format('DD/MM/YYYY HH:mm:ss'),
            receptionDate: receptionDate?.format('DD/MM/YYYY HH:mm:ss'),
            clientId: selectedClient.id,
            totalAmount: totalAmount
        }
        console.log(purchase);
        if (selectedPurchase) {
            purchase.id = selectedPurchase.id;
            PurchaseService.update(purchase).then(({ data }) => {
                handleUpdateDone(data);
            }).catch(err => {
                console.log(err)
                if (err.response.data.cause) {
                    handleShowNotification(tPurchase(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        } else {
            PurchaseService.add(purchase).then(({ data }) => {
                handleAddDone(data);
            }).catch(err => {
                console.log(err)
                if (err.response.data.cause) {
                    handleShowNotification(tPurchase(err.response.data.cause), 'error');
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
        if (open && selectedPurchase) {
            reset(selectedPurchase)
            setPurchaseDate(moment(selectedPurchase.purchaseDate, 'DD/MM/YYYY hh:mm:ss'))
            setDeliveryDate(selectedPurchase.deliveryDate ? moment(selectedPurchase.deliveryDate, 'DD/MM/YYYY hh:mm:ss') : null)
            setReceptionDate(selectedPurchase.receptionDate ? moment(selectedPurchase.receptionDate, 'DD/MM/YYYY hh:mm:ss') : null)
            setSelectedClient(clients.find(x => x.id === selectedPurchase.clientId))
            setTotalAmount(selectedPurchase.totalAmount)
            setProductsList(selectedPurchase.purchaseProducts)
        } else {
            reset({
                ref: '',
                state: "registered",
                purchaseDate: '',
                deliveryDate: '',
                receptionDate: '',
            });
            setPurchaseDate(new Date())
            setDeliveryDate(null)
            setReceptionDate(null)
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
                    {selectedPurchase ? tPurchase('edit_title') : tPurchase('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedPurchase ? tPurchase('edit_desc') : tPurchase('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>

                <form
                    id="add-purchase-form"
                    onSubmit={handleSubmit(handleSave)}
                >
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="ref"
                                label={tGeneral("ref")}
                                variant="outlined"
                                name="ref"
                                required
                                fullWidth
                                defaultValue={selectedPurchase?.ref}
                                {...register('ref')}
                            //style={{ marginTop: 23 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AutoComplete
                                defaultValue={selectedPurchase ? { name: tGeneral(selectedPurchase?.state), value: selectedPurchase?.state } : { name: tGeneral("registered"), value: "registered" }}
                                options={GeneratePurchaseStates(tGeneral)}
                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                fullWidth
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        {option.icon}
                                        {option.name}
                                    </Box>
                                )}
                                readOnly={!selectedPurchase}
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
                        <Grid item xs={12} md={12}>
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
                            <DateTimePicker
                                value={purchaseDate}
                                onChange={(value) => {
                                    console.log(value)
                                    setPurchaseDate(value)
                                }}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="purchaseDate"
                                        name="purchaseDate"
                                        {...params}
                                        label={tPurchase("purchase_date")}
                                        {...register('purchaseDate')}
                                        required
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={deliveryDate}
                                onChange={setDeliveryDate}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="deliveryDate"
                                        name="deliveryDate"
                                        {...params}
                                        label={tPurchase("delivery_date")}
                                        {...register('deliveryDate')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DateTimePicker
                                value={receptionDate}
                                onChange={setReceptionDate}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="receptionDate"
                                        name="receptionDate"
                                        {...params}
                                        label={tPurchase("reception_date")}
                                        {...register('receptionDate')}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className="flex justify-center">
                                <Button variant="contained" onClick={handleOpenProductsGallery} color="secondary">
                                    {tPurchase('select_products')}
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="totalAmount"
                                label={tPurchase("total_amount")}
                                variant="outlined"
                                name="totalAmount"
                                required
                                fullWidth
                                defaultValue={selectedPurchase ? selectedPurchase.totalAmount : 0}
                                value={totalAmount}
                                {...register('totalAmount', { valueAsNumber: true })}
                                InputProps={{
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
                                label={tPurchase("reduction")}
                                variant="outlined"
                                name="reduction"
                                fullWidth
                                defaultValue={selectedPurchase ? selectedPurchase.reduction : 0}
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
                <Button onClick={handleSave} color="secondary" type="submit" form="add-purchase-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditPurchaseDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedPurchase: PropTypes.object,
}

AddEditPurchaseDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedPurchase: null,
}

export default AddEditPurchaseDialog;