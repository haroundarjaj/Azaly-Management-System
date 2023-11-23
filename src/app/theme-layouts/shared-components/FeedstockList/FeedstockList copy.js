import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import FeedstockService from "src/app/services/FeedstockService";
import AutoComplete from "../AutoComplete";

function FeedstockList(props) {
    const {
        handleClose,
        open,
        handleSave,
        data,
        selectedElements,
        preview,
    } = props;

    const [feedstockItems, setFeedstockItems] = useState([])
    const [selectedItems, setSelectedItems] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(false)


    const tGeneral = useTranslation('generalTranslations').t;
    const tFeedstock = useTranslation('feedstockPage').t;

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

    const handleSelectItem = (item) => {
        const list = [...selectedItems];
        if (list.some(p => p.item.ref === item.ref)) {
            const removeIndex = list.map(item => item.item.ref).indexOf(item.ref);
            list.splice(removeIndex, 1)
        } else {
            list.push({
                item: item,
                quantity: 1,
                price: item.price
            })
        }
        setSelectedItems(list)
    }

    const handleChange = (e, item) => {
        const list = [...selectedItems];
        list.map(obj => {
            if (obj.item.ref === item.ref) {
                obj[e.target.name] = e.target.value;
                obj.price = item.price;
            }
            return obj;
        })
        setSelectedItems(list);
    }

    const handleDone = () => {
        handleSave(selectedItems);
        handleClose();
    }

    useEffect(() => {
        if (open && data) {
            setFeedstockItems(data)
        } else if (open && !data) {
            setIsLoadingData(true)
            FeedstockService.getAll()
                .then(({ data }) => {
                    data.sort((a, b) => {
                        const textA = a.ref.toUpperCase();
                        const textB = b.ref.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    });
                    setFeedstockItems(data);
                })
                .finally(() => {
                    setIsLoadingData(false)
                })
        }
        if (open && selectedElements) {
            setSelectedItems(selectedElements)
        }
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {tFeedstock('feedstock_list')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {isLoadingData ?
                    <LinearProgress color="secondary" />
                    : feedstockItems.length === 0 ?
                        <div className="w-full flex justify-center">
                            <Typography variant="subtitle1" color="primary">{tGeneral("no_data_to_show")}</Typography>
                        </div>
                        :
                        <Grid
                            container
                            spacing={2}
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            {feedstockItems.map((item, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    key={index}
                                >
                                    <div className='flex flex-col justify-between items*-center mb-10' style={{ height: 350 }} >
                                        <div
                                            className={selectedItems.some(obj => obj.item.ref === item.ref) ? "flex justify-center items-center border-solid border-3 border-themePrimary rounded-md shadow-lg shadow-themePrimary-500" : "flex justify-center items-center"}
                                        >
                                            {preview ? <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ maxWidth: "100%", maxHeight: 320 }}
                                            /> :
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ maxWidth: "100%", maxHeight: 320, cursor: "pointer" }}
                                                    onClick={() => handleSelectItem(item)}
                                                />
                                            }
                                        </div>
                                        <div className="flex flex-row w-full justify-between items-end">
                                            <Typography variant="subtitle2" color='secondary'>{item.name}</Typography>
                                            <Typography variant="subtitle2">{item.ref}</Typography>
                                        </div>
                                    </div>
                                    {selectedItems.find(obj => obj.item.ref === item.ref) &&
                                        <div className="flex flex-row justify-between">
                                            <TextField
                                                id="quantity"
                                                label={tGeneral('quantity')}
                                                variant="outlined"
                                                name="quantity"
                                                required
                                                type="number"
                                                style={{ width: '48%' }}
                                                value={selectedItems.find(obj => obj.item.ref === item.ref)?.quantity}
                                                onChange={(e) => handleChange(e, item)}
                                                InputProps={{
                                                    readOnly: preview,
                                                    inputProps: { min: 1 }
                                                }}
                                            />
                                            <TextField
                                                id="price"
                                                label={tGeneral('price')}
                                                variant="outlined"
                                                name="price"
                                                type="number"
                                                style={{ width: '48%' }}
                                                value={selectedItems.find(obj => obj.item.ref === item.ref)?.price}
                                                onChange={(e) => handleChange(e, item)}
                                                InputProps={{
                                                    readOnly: preview,
                                                    inputProps: { min: 1 }
                                                }}
                                            />
                                        </div>

                                    }
                                </Grid>
                            ))}
                        </Grid>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                {handleSave ? <Button color="secondary" onClick={() => handleDone(selectedItems)} disabled={selectedItems.length === 0}>
                    {tGeneral('save')}
                </Button> : <></>
                }
            </DialogActions>
        </Dialog>
    )

}

FeedstockList.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleSave: PropTypes.func,
    data: PropTypes.array,
    selectedElements: PropTypes.array,
    preview: PropTypes.bool.isRequired
}

FeedstockList.defaultProps = {
    handleClose: () => { },
    open: false,
    preview: false
}

export default FeedstockList;