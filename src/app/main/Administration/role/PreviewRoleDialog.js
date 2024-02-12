import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';
import ImageUploader from 'app/theme-layouts/shared-components/ImageViewer/ImageUploader';
import ReactToPrint from "react-to-print";

function PreviewRoleDialog(props) {
    const componentRef = useRef();

    const tRole = useTranslation('rolesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedRole
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
            maxWidth="xs"
        >
            <DialogTitle className="hide-print">
                <Typography variant="subtitle1" color="secondary">
                    {tGeneral('preview')}
                </Typography>
            </DialogTitle>
            <DialogContent ref={componentRef}>
                <Grid
                    container
                    alignItems="flex-start"
                    justifyContent="center"
                    spacing={3}
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <div className=" w-full flex justify-center">
                            <ImageUploader width={400} height={400} uploadedImage={selectedRole?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`} />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className='flex flex-row'>
                            <Typography variant="subtitle1" color="secondary">{`${tGeneral("name")} :   `}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedRole?.name}</Typography>
                        </div>

                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="secondary">{`${tGeneral("description")} :`}</Typography>
                        <Typography variant="subtitle1">{selectedRole?.description}</Typography>
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

PreviewRoleDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedRole: PropTypes.object,
}

PreviewRoleDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedRole: null,
}

export default PreviewRoleDialog;