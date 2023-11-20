import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Paper } from "@mui/material";
import { tableCellClasses } from '@mui/material/TableCell';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';
import ImageUploader from 'app/theme-layouts/shared-components/ImageViewer/ImageUploader';
import styled from 'styled-components';
import ReactToPrint from "react-to-print";

function PreviewOrderDialog(props) {
    const componentRef = useRef();

    const tOrder = useTranslation('ordersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedOrder
    } = props;

    const StyledTableCell = styled(TableCell)(({ theme }) => {
        console.log(theme);
        return ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: '#BF8F30',
                color: '#FFFFFF',
            }
        })
    });

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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            {console.log(selectedOrder)}
            <DialogTitle className="hide-print">
                <Typography variant="subtitle1" color="secondary">
                    {tGeneral('preview')}
                </Typography>
            </DialogTitle>
            <DialogContent ref={componentRef}>
                <iframe id="ifmcontentstoprint" style={{ height: "0px", width: "0px", position: 'absolute' }}></iframe>
                <div id='printablediv'>
                    <Grid
                        container
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        spacing={3}
                    >
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("ref")} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.ref}</Typography>
                            </div>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("state")} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{tOrder(selectedOrder?.state)}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder('registered_date')} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.registeredDate}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder('confirmed_date')} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.confirmedDate || `__/__/____   __:__:__`}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder('shipped_date')} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.ShippedDate || `__/__/____   __:__:__`}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder('delivered_date')} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.deliveredDate || '__/__/____   __:__:__'}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder('canceled_date')} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.canceledDate || '__/__/____   __:__:__'}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder("total_amount")} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.totalAmount}</Typography>
                            </div>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tOrder("reduction")} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.reduction}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}>{tGeneral('image')}</TableCell>
                                            <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }} align="right">{tGeneral('ref')}</TableCell>
                                            <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }} align="right">{tGeneral('name')}</TableCell>
                                            <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }} align="right">{tGeneral('quantity')}</TableCell>
                                            <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }} align="right">{tGeneral('price')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder?.orderProducts?.map((row) => (
                                            <TableRow
                                                key={row.product?.ref}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Avatar
                                                        alt={tGeneral('image')}
                                                        src={row.product?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                                                        style={{ width: 60, height: 60 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{row.product?.ref}</TableCell>
                                                <TableCell align="right">{row.product?.name}</TableCell>
                                                <TableCell align="right">{row.quantity}</TableCell>
                                                <TableCell align="right">{row.price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </div>
            </DialogContent>
            <DialogActions className="hide-print">
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                <ReactToPrint
                    bodyClass="print-agreement"
                    content={() => componentRef.current}
                    trigger={() => (
                        <Button color="secondary" >
                            {tGeneral('print')}
                        </Button>
                    )}
                />
            </DialogActions>
        </Dialog>
    )

}

PreviewOrderDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedOrder: PropTypes.object,
}

PreviewOrderDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedOrder: null,
}

export default PreviewOrderDialog;