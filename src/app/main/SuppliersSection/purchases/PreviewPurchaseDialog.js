import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Paper } from "@mui/material";
import { tableCellClasses } from '@mui/material/TableCell';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';
import ImageUploader from 'app/theme-layouts/shared-components/ImageViewer/ImageUploader';
import styled from 'styled-components';
import ReactToPrint from "react-to-print";

function PreviewPurchaseDialog(props) {
    const componentRef = useRef();

    const tPurchase = useTranslation('purchasesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedPurchase
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
            {console.log(selectedPurchase)}
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
                        <Grid item xs={12} md={4}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("ref")} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedPurchase?.ref}</Typography>
                            </div>

                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral('date')} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{selectedPurchase?.date}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className='flex flex-row'>
                                <Typography variant="subtitle1" color="secondary">{`${tPurchase("total_amount")} :`}</Typography>
                                <Typography variant="subtitle1" className='ml-10'>{`${selectedPurchase?.totalAmount} MAD`}</Typography>
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
                                        {selectedPurchase?.purchasedFeedstock?.map((row) => (
                                            <TableRow
                                                key={row.item?.ref}
                                                sx={{ '&:last-child td, &:last-child th': { bpurchase: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Avatar
                                                        alt={tGeneral('image')}
                                                        src={row.item?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                                                        style={{ width: 60, height: 60 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{row.item?.ref}</TableCell>
                                                <TableCell align="right">{row.item?.name}</TableCell>
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

PreviewPurchaseDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedPurchase: PropTypes.object,
}

PreviewPurchaseDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedPurchase: null,
}

export default PreviewPurchaseDialog;