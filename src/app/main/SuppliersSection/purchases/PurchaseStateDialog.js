import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import GeneratePurchaseStates from "./GeneratePurchaseStates";
import PurchaseService from "src/app/services/PurchaseService";

function PurchaseStateDialog(props) {
    const tPurchase = useTranslation('purchasesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const { purchase, open, handleClose, handleSave } = props;

    const [selectedState, setSelectedState] = useState('registered');

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

    const handleChange = (event) => {
        console.log("handle change", event);
        setSelectedState(event.target.value);
    };



    useEffect(() => {
        if (open) {
            setSelectedState(purchase.state)
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {tPurchase('update_state')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>
                <Grid
                    spacing={1}
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    direction="row"
                >
                    <Grid item xs={6}>
                        <FormControl>
                            {/* <FormLabel id="purchase-state-radio-buttons-group">{tPurchase('state')}</FormLabel> */}
                            <RadioGroup
                                aria-labelledby="purchase-state-radio-buttons-group"
                                name="rder-state-radio-buttons-group"
                                value={selectedState}
                                onChange={handleChange}
                            >
                                {GeneratePurchaseStates(tGeneral).map(state => (
                                    <FormControlLabel
                                        value={state.value}
                                        control={<Radio color='secondary' />}
                                        label={<Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {state.icon}
                                            {state.name}
                                        </Box>}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={5}>
                        <Typography variant="body1">{GeneratePurchaseStates(tGeneral).filter(state => state.value === selectedState)[0].description}</Typography>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                <Button onClick={() => handleSave(selectedState, purchase.id)} color="secondary">
                    {tGeneral('update')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PurchaseStateDialog;