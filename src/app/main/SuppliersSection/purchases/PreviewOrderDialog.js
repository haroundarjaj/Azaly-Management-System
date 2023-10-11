import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormGroup, FormControlLabel, Checkbox, Avatar } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';
import ImageUploader from 'app/theme-layouts/shared-components/ImageViewer/ImageUploader';

function PreviewOrderDialog(props) {
    const componentRef = useRef();

    const tOrder = useTranslation('ordersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedOrder
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
                        {/* {<ProfilePicture
                            ref={orderImageRef}
                            image={selectedOrder?.image}
                            useHelper
                            frameFormat='square'
                            frameSize={500}
                            cropSize={200}
                            onStatusChange={handleError}
                            minImageSize={200}
                            messages={
                                {
                                    DEFAULT: tGeneral('image_tap'),
                                    DRAGOVER: tGeneral('image_drop'),
                                    INVALID_FILE_TYPE: "",
                                    INVALID_IMAGE_SIZE: ""
                                }
                            }
                        />} */}
                        <div className=" w-full flex justify-center">
                            <ImageUploader width={400} height={400} uploadedImage={selectedOrder?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`} />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className='flex flex-row'>
                            <Typography variant="subtitle1" color="secondary">{`${tGeneral("name")} :   `}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedOrder?.name}</Typography>
                        </div>

                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="secondary">{`${tGeneral("description")} :`}</Typography>
                        <Typography variant="subtitle1">{selectedOrder?.description}</Typography>
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