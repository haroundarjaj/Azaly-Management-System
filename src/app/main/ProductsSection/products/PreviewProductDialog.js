import React, { useRef } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../../utils/print/PrintStylesheet.css';
import ImageUploader from 'app/theme-layouts/shared-components/ImageViewer/ImageUploader';

function PreviewProductDialog(props) {
    const componentRef = useRef();

    const tProduct = useTranslation('productsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        open,
        selectedProduct
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
            maxWidth="sm"
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
                    justifyContent="space-around"
                    spacing={3}
                    className="p-20"
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <div className=" w-full flex justify-center">
                            <ImageUploader width={400} height={400} uploadedImage={selectedProduct?.image || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`} />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='flex flex-row'>
                            <Typography variant="subtitle1" color="secondary">{`${tGeneral("name")}:`}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedProduct?.name}</Typography>
                        </div>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='flex flex-row justify-end'>
                            <Typography variant="subtitle1" color="secondary">{`${tGeneral("ref")} :`}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedProduct?.ref}</Typography>
                        </div>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color="secondary">{`${tGeneral("description")} :`}</Typography>
                        <Typography variant="subtitle1">{selectedProduct?.description}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='flex flex-row justify-end'>
                            <Typography variant="subtitle1" color="secondary">{`${tProduct("category")} :`}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedProduct?.categoryName}</Typography>
                        </div>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='flex flex-row'>
                            <Typography variant="subtitle1" color="secondary">{`${tProduct("unit_price")} :`}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedProduct?.unitPrice}</Typography>
                        </div>

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className='flex flex-row justify-end'>
                            <Typography variant="subtitle1" color="secondary">{`${tProduct("wholesale_price")} :`}</Typography>
                            <Typography variant="subtitle1" className='ml-10'>{selectedProduct?.wholesalePrice}</Typography>
                        </div>

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

PreviewProductDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedProduct: PropTypes.object,
}

PreviewProductDialog.defaultProps = {
    handleClose: () => { },
    open: false,
    selectedProduct: null,
}

export default PreviewProductDialog;