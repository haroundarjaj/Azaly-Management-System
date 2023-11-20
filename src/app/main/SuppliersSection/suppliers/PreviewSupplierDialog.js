import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';
import ReactToPrint from "react-to-print";

function PreviewSupplierDialog(props) {
    const componentRef = useRef();

    const tSupplier = useTranslation('suppliersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedSupplier
    } = props;

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
            <DialogTitle className="hide-print">
                <Typography variant="subtitle1" color="secondary">
                    {tGeneral('preview')}
                </Typography>
            </DialogTitle>
            <DialogContent ref={componentRef}>
                <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                >
                    <Grid
                        item
                        container
                        xs={12}
                        md={4}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Avatar
                            alt={tGeneral('profile_picture')}
                            src={selectedSupplier?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                            style={{ width: 200, height: 200 }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={8}
                    >
                        <Grid
                            container
                            spacing={2}
                        >
                            <Grid container item xs={12} md={6}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="secondary">{`${tGeneral("first_name")} :`}</Typography>
                                    <Typography variant="subtitle2">{selectedSupplier?.firstName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="secondary">{`${tGeneral("last_name")} :`}</Typography>
                                    <Typography variant="subtitle2">{selectedSupplier?.lastName}</Typography>
                                </Grid>

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("address")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedSupplier?.address}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("email")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedSupplier?.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("phone_number")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedSupplier?.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormGroup >
                                    <FormControlLabel
                                        control={<Checkbox name="isIndividual" color="secondary" defaultChecked={selectedSupplier?.isIndividual === "yes"} readOnly />}
                                        label={<Typography variant='p'>{tSupplier('individual_supplier')}</Typography>}
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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

PreviewSupplierDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedSupplier: PropTypes.object,
}

PreviewSupplierDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedSupplier: null,
}

export default PreviewSupplierDialog;