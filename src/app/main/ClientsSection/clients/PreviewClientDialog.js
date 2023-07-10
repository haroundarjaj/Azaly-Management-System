import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';

function PreviewClientDialog(props) {
    const componentRef = useRef();

    const tClient = useTranslation('clientsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedClient
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
                            src={selectedClient?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
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
                                    <Typography variant="subtitle2">{selectedClient?.firstName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="secondary">{`${tGeneral("last_name")} :`}</Typography>
                                    <Typography variant="subtitle2">{selectedClient?.lastName}</Typography>
                                </Grid>

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("address")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedClient?.address}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("email")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedClient?.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("phone_number")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedClient?.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormGroup >
                                    <FormControlLabel
                                        control={<Checkbox name="isIndividual" color="secondary" defaultChecked={selectedClient?.isIndividual === "yes"} readOnly />}
                                        label={<Typography variant='p'>{tClient('individual_client')}</Typography>}
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
                <Button onClick={() => { window.print() }} color="secondary" >
                    {tGeneral('print')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

PreviewClientDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedClient: PropTypes.object,
}

PreviewClientDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedClient: null,
}

export default PreviewClientDialog;