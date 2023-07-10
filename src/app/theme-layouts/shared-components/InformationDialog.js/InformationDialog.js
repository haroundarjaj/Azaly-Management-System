import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function InformationDialog(props) {
    const { open, variant, content, handleConfirm, handleClose } = props;

    const tGeneral = useTranslation('generalTranslations').t;

    const getVariantIcon = () => {
        switch (variant) {
            case 'warning':
                return 'heroicons-outline:exclamation';
            case 'error':
                return 'heroicons-outline:exclamation-circle';
            case 'info':
                return 'heroicons-outline:information-circle';
            case 'success':
                return 'heroicons-outline:check-circle';
            default:
                return 'heroicons-outline:information-circle';
        }
    }

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
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <div className='flex flex-row'>
                    <FuseSvgIcon
                        color={variant}
                        size={28}
                    >
                        {getVariantIcon()}
                    </FuseSvgIcon>
                    <Typography variant="subtitle1" color="secondary" className="mx-20">
                        {tGeneral(variant)}
                    </Typography>
                </div>
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                {handleConfirm &&
                    <Button onClick={handleConfirm} color="secondary">
                        {tGeneral('confirm')}
                    </Button>
                }
            </DialogActions>
        </Dialog>
    )

}

InformationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    handleConfirm: PropTypes.func,
    handleClose: PropTypes.func.isRequired,
}

InformationDialog.defaultProps = {
    open: false,
    variant: "info",
    content: "This is an information dialog",
    handleClose: () => { },
}

export default InformationDialog;