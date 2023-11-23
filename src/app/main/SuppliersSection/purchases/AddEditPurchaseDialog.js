import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Autocomplete, Popper, Box, InputAdornment } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import "profile-picture/build/ProfilePicture.css";
import PurchaseService from "src/app/services/PurchaseService";
import { useForm } from "react-hook-form";
import AutoComplete from "app/theme-layouts/shared-components/AutoComplete";
import SupplierService from "src/app/services/SupplierService";
import { DateTimePicker } from '@mui/x-date-pickers';
import FeedstockList from "app/theme-layouts/shared-components/FeedstockList/FeedstockList";
import moment from "moment";

function AddEditPurchaseDialog(props) {
    const tFeedstock = useTranslation('feedstockPage').t;
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

    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [purchaseDate, setPurchaseDate] = useState(new Date());
    const [openFeedstockList, setOpenFeedstockList] = useState(false);
    const [feedstockItems, setFeedstockItems] = useState([]);
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
        const purchase = {
            ...data,
            purchasedFeedstock: feedstockItems,
            date: moment(purchaseDate).format('DD/MM/YYYY HH:mm:ss'),
            supplierId: selectedSupplier.id,
            totalAmount: totalAmount
        }
        console.log("testadd", purchase);
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

    const handleOpenFeedstockList = () => {
        setOpenFeedstockList(true);
    }

    const handleCloseFeedstockList = () => {
        setOpenFeedstockList(false);
    }

    const handleSaveSelectingFeedstockItems = (list) => {
        setFeedstockItems(list);
        let total = 0;
        list.forEach(elem => {
            total += elem.price * elem.quantity;
        })
        setTotalAmount(total)
    }

    const handleChangeSupplier = (newValue) => {
        console.log(newValue);
        setSelectedSupplier(newValue)
    }

    useEffect(() => {
        if (open && selectedPurchase) {
            reset(selectedPurchase)
            setPurchaseDate(moment(selectedPurchase.purchaseDate))
            setSelectedSupplier(suppliers.find(x => x.id === selectedPurchase.supplierId))
            setTotalAmount(selectedPurchase.totalAmount)
            setFeedstockItems(selectedPurchase.purchasedFeedstock)
        } else {
            reset({
                ref: '',
                date: '',
            });
            setSelectedSupplier(null)
            setFeedstockItems([])
            setTotalAmount(0)
        };
    }, [open])

    useEffect(() => {
        SupplierService.getAll().then(({ data }) => {
            data.sort((a, b) => {
                const textA = a.firstName.toUpperCase();
                const textB = b.firstName.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
            setSuppliers(data);
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
                                options={suppliers}
                                getOptionLabel={(option) => `${option?.firstName} ${option?.lastName}` || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                fullWidth
                                value={selectedSupplier}
                                onChange={(e, newValue) => handleChangeSupplier(newValue)}
                                renderInput={(params) =>
                                    <TextField
                                        id="supplier"
                                        name="supplier"
                                        {...params}
                                        label={tGeneral("supplier")}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                value={purchaseDate}
                                onChange={(value) => {
                                    console.log(value)
                                    setPurchaseDate(value)
                                }}
                                ampm={false}
                                renderInput={(params) =>
                                    <TextField
                                        id="date"
                                        name="date"
                                        {...params}
                                        label={tGeneral("date")}
                                        {...register('date')}
                                        required
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                id="totalAmount"
                                label={tGeneral("total_amount")}
                                variant="outlined"
                                name="totalAmount"
                                required
                                fullWidth
                                defaultValue={selectedPurchase ? selectedPurchase.totalAmount : 0}
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
                        <Grid item xs={12}>
                            <div className="flex justify-center">
                                <Button variant="contained" onClick={handleOpenFeedstockList} color="secondary">
                                    {tFeedstock('select_feedstock_items')}
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
                <FeedstockList
                    handleClose={handleCloseFeedstockList}
                    open={openFeedstockList}
                    handleSave={handleSaveSelectingFeedstockItems}
                    selectedElements={feedstockItems}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                <Button color="secondary" type="submit" form="add-purchase-form">
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