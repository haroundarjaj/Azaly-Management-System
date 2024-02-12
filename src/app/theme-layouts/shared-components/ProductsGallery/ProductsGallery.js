import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import ProductService from "src/app/services/ProductService";
import ProductCategoryService from "src/app/services/ProductCategoryService";
import AutoComplete from "../AutoComplete";

function ProductsGallery(props) {
    const {
        handleClose,
        open,
        handleSave,
        data,
        selectedElements,
        preview,
    } = props;

    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])
    const [productCategories, setProductCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isLoadingData, setIsLoadingData] = useState(false)


    const tGeneral = useTranslation('generalTranslations').t;
    const tProduct = useTranslation('productsPage').t;
    const tCategory = useTranslation('categoriesPage').t;

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

    const handleSelectProduct = (product) => {
        const list = [...selectedProducts];
        if (list.some(p => p.product.ref === product.ref)) {
            const removeIndex = list.map(item => item.product.ref).indexOf(product.ref);
            list.splice(removeIndex, 1)
        } else {
            list.push({
                product: product,
                quantity: 1,
                price: product.unitPrice
            })
        }
        setSelectedProducts(list)
    }

    const handleChange = (e, product) => {
        const list = [...selectedProducts];
        list.map(obj => {
            if (obj.product.ref === product.ref) {
                obj[e.target.name] = e.target.value;
                if (e.target.name === "quantity" && e.target.value < 10) {
                    obj.price = product.unitPrice;
                } else if (e.target.name === "quantity" && e.target.value >= 10) {
                    obj.price = product.wholesalePrice;
                }
            }
            return obj;
        })
        setSelectedProducts(list);
    }

    const filterByCategory = (newValue) => {
        setSelectedCategory(newValue)
        if (newValue) {
            const list = products.filter(p => p.categoryName === newValue.name)
            setFilteredProducts(list)
        } else setFilteredProducts(products)
    }

    const handleDone = () => {
        handleSave(selectedProducts);
        handleClose();
    }

    useEffect(() => {
        if (open && data) {
            setProducts(data)
            setFilteredProducts(data)
        } else if (open && !data) {
            setIsLoadingData(true)
            ProductService.getAll()
                .then(({ data }) => {
                    data.sort((a, b) => {
                        const textA = a.ref.toUpperCase();
                        const textB = b.ref.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    });
                    setProducts(data);
                    setFilteredProducts(data)
                })
                .finally(() => {
                    setIsLoadingData(false)
                })
            ProductCategoryService.getAll().then(({ data }) => {
                data.sort((a, b) => {
                    const textA = a.name.toUpperCase();
                    const textB = b.name.toUpperCase();
                    return textA < textB ? -1 : textA > textB ? 1 : 0;
                });
                setProductCategories(data);
            })
        }
        if (open && selectedElements) {
            setSelectedProducts(selectedElements)
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
                    {tProduct('products_gallery')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {isLoadingData ?
                    <LinearProgress color="secondary" />
                    : products.length === 0 ?
                        <div className="w-full flex justify-center">
                            <Typography variant="subtitle1" color="primary">{tGeneral("no_data_to_show")}</Typography>
                        </div>
                        :
                        <>
                            {!preview && <AutoComplete
                                options={productCategories}
                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={selectedCategory}
                                onChange={(e, newValue) => filterByCategory(newValue)}
                                style={{ width: "25%", marginBottom: 20, marginTop: 20 }}
                                renderInput={(params) =>
                                    <TextField
                                        id="productCategory"
                                        name="productCategory"
                                        {...params}
                                        label={tCategory("filter_by_category")}
                                    />
                                }
                            />
                            }
                            <Grid
                                container
                                spacing={2}
                                justifyContent="flex-start"
                                alignItems="flex-start"
                            >
                                {filteredProducts.map((product, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={3}
                                        key={index}
                                    >
                                        {console.log(product)}
                                        {console.log(product)}
                                        <div className='flex flex-col justify-between items*-center mb-10' style={{ height: 350 }} >
                                            <div
                                                className={selectedProducts.some(obj => obj.product.ref === product.ref) ? "flex justify-center items-center border-solid border-3 border-themePrimary rounded-md shadow-lg shadow-themePrimary-500" : "flex justify-center items-center"}
                                            >
                                                {preview ? <img
                                                    src={product.image || `${process.env.PUBLIC_URL}/assets/images/avatars/no-product-image.jpeg`}
                                                    alt={product.name}
                                                    style={{ maxWidth: "100%", maxHeight: 320 }}
                                                /> :
                                                    <img
                                                        src={product.image || `${process.env.PUBLIC_URL}/assets/images/avatars/no-product-image.jpeg`}
                                                        alt={product.name}
                                                        style={{ maxWidth: "100%", maxHeight: 320, cursor: "pointer" }}
                                                        onClick={() => handleSelectProduct(product)}
                                                    />
                                                }
                                            </div>
                                            <div className="flex flex-row w-full justify-between items-end">
                                                <Typography variant="subtitle2" color='secondary'>{product.name}</Typography>
                                                <Typography variant="subtitle2">{product.ref}</Typography>
                                            </div>
                                        </div>
                                        {selectedProducts.find(obj => obj.product.ref === product.ref) &&
                                            <div className="flex flex-row justify-between">
                                                <TextField
                                                    id="quantity"
                                                    label={tGeneral('quantity')}
                                                    variant="outlined"
                                                    name="quantity"
                                                    required
                                                    type="number"
                                                    style={{ width: '48%' }}
                                                    value={selectedProducts.find(obj => obj.product.ref === product.ref)?.quantity}
                                                    onChange={(e) => handleChange(e, product)}
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
                                                    value={selectedProducts.find(obj => obj.product.ref === product.ref)?.price}
                                                    onChange={(e) => handleChange(e, product)}
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
                        </>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                {handleSave ? <Button color="secondary" onClick={() => handleDone(selectedProducts)} disabled={selectedProducts.length === 0}>
                    {tGeneral('save')}
                </Button> : <></>
                }
            </DialogActions>
        </Dialog>
    )

}

ProductsGallery.propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleSave: PropTypes.func,
    data: PropTypes.array,
    selectedElements: PropTypes.array,
    preview: PropTypes.bool.isRequired
}

ProductsGallery.defaultProps = {
    handleClose: () => { },
    open: false,
    preview: false
}

export default ProductsGallery;