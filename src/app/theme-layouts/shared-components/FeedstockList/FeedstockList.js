import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
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

    const handleSelectItem = (e, item) => {
        const list = [...selectedItems];
        if (!e.target.checked) {
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
        console.log(data)
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
                        <TableContainer sx={{ maxHeight: 580 }}>
                            <Table
                                stickyHeader
                                sx={{
                                    [`& .${tableCellClasses.root}`]: {
                                        borderBottom: 1,
                                        borderColor: 'rgb(191, 143, 48, 0.3)'
                                    }
                                }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}></TableCell>
                                        <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}>{tGeneral('image')}</TableCell>
                                        <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}>{tGeneral('ref')}</TableCell>
                                        <TableCell style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}>{tGeneral('name')}</TableCell>
                                        <TableCell align="right" style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}>{tGeneral('quantity')}</TableCell>
                                        <TableCell align="right" style={{ backgroundColor: '#BF8F30', color: '#FFFFFF', }}>{tGeneral('price')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {console.log(feedstockItems)}
                                    {feedstockItems.map((item, index) => (
                                        <TableRow
                                            key={item.ref}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {console.log(selectedItems)}
                                                {console.log(item)}
                                                <Checkbox
                                                    checked={selectedItems.some(obj => obj.item.ref === item.ref)}
                                                    onChange={(e) => handleSelectItem(e, item)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center items-center w-full">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{ maxWidth: "100%", maxHeight: 100 }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">{item.ref}</TableCell>
                                            <TableCell align="right">{item.name}</TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    id="quantity"
                                                    label={tGeneral('quantity')}
                                                    variant="outlined"
                                                    name="quantity"
                                                    required
                                                    type="number"
                                                    style={{ width: '48%' }}
                                                    disabled={!selectedItems.some(obj => obj.item.ref === item.ref)}
                                                    defaultValue={0}
                                                    value={selectedItems.find(obj => obj.item.ref === item.ref)?.quantity || 0}
                                                    onChange={(e) => handleChange(e, item)}
                                                    InputProps={{
                                                        readOnly: preview,
                                                        inputProps: { min: 1 }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    id="price"
                                                    label={tGeneral('price')}
                                                    variant="outlined"
                                                    name="price"
                                                    type="number"
                                                    style={{ width: '48%' }}
                                                    disabled={!selectedItems.some(obj => obj.item.ref === item.ref)}
                                                    defaultValue={0}
                                                    value={selectedItems.find(obj => obj.item.ref === item.ref)?.price || 0}
                                                    onChange={(e) => handleChange(e, item)}
                                                    InputProps={{
                                                        readOnly: preview,
                                                        inputProps: { min: 1 }
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
        </Dialog >
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