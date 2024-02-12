import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ReactToPrint from "react-to-print";
import '../../../utils/print/PrintStylesheet.css';
import moment from 'moment';

function PreviewUserDialog(props) {
    const componentRef = useRef();

    const tUser = useTranslation('usersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedUser
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
                            src={selectedUser?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
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
                                    <Typography variant="subtitle2">{selectedUser?.firstName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="secondary">{`${tGeneral("last_name")} :`}</Typography>
                                    <Typography variant="subtitle2">{selectedUser?.lastName}</Typography>
                                </Grid>

                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("address")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedUser?.address}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("email")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedUser?.email}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("phone_number")} :`}</Typography>
                                <Typography variant="subtitle2">{selectedUser?.phoneNumber}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" color="secondary">{`${tGeneral("joined on")} :`}</Typography>
                                <Typography variant="subtitle2">{moment(selectedUser?.createdDate).format("DD/MM/yyyy hh:mm")}</Typography>
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

PreviewUserDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedUser: PropTypes.object,
}

PreviewUserDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedUser: null,
}

export default PreviewUserDialog;