import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditProductDialog from "./AddEditProductDialog";
import { useContext, useEffect, useState } from "react";
import ProductService from "src/app/services/ProductService";
import { Avatar, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewProductDialog from "./PreviewProductDialog";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import { AbilityContext } from "src/app/auth/Can";

let setSelectedRowsFunc = null;

function ProductMainPage(props) {
    const tProduct = useTranslation('productsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    console.log(useTranslation('productsPage'))

    const [isOpenAddEditProductDialog, setIsOpenAddEditProductDialog] = useState(false);
    const [isOpenPreviewProductDialog, setIsOpenPreviewProductDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const dispatch = useDispatch();
    const ability = useContext(AbilityContext);


    const renderColumns = () => {
        return [
            {
                label: tGeneral('ref'),
                name: 'ref',
            },
            {
                label: tGeneral('name'),
                name: 'name',
            },
            {
                label: tProduct('category'),
                name: 'categoryName',
            },
            {
                label: tGeneral('description'),
                name: 'description',
                options: {
                    filter: false,
                    display: false
                }
            },
            {
                label: tProduct('unit_price'),
                name: 'unitPrice',
            },
            {
                label: tProduct('wholesale_price'),
                name: 'wholesalePrice',
            },
            {
                name: 'image',
                label: tGeneral('image'),
                options: {
                    filter: false,
                    sort: false,
                    empty: true,
                    download: false,
                    customBodyRender: (value, row) => (
                        <Avatar
                            alt={tGeneral('image')}
                            src={value || `${process.env.PUBLIC_URL}/assets/images/avatars/general-avatar.svg`}
                            onClick={() => handleOpenImageViewer(value)}
                            style={{ width: 60, height: 60 }}
                        />
                    )

                }
            }
        ]
    }

    const handleOpenAddEditProductDialog = () => {
        setIsOpenAddEditProductDialog(true);
    }

    const handleCloseAddEditProductDialog = () => {
        setIsOpenAddEditProductDialog(false);
        setSelectedProduct(null);
    }

    const handleOpenPreviewProductDialog = (product) => {
        setIsOpenPreviewProductDialog(true);
        setSelectedProduct(product);
    }

    const handleClosePreviewProductDialog = () => {
        setIsOpenPreviewProductDialog(false);
    }

    const handleOpenEdit = (product) => {
        setIsOpenAddEditProductDialog(true);
        setSelectedProduct(product);
    }

    const handleAddDone = (addedProduct) => {
        const list = [].concat(allProducts);
        list.push(addedProduct);
        setAllProducts(list);
        setIsOpenAddEditProductDialog(false);
        dispatch(showMessage({ message: 'Created Successfully', variant: 'success' }));
    }

    const handleUpdateDone = (product) => {
        const list = [].concat(allProducts);
        const removeIndex = list.map(item => item.id).indexOf(product.id);
        list.splice(removeIndex, 1, product);
        setAllProducts(list);
        setIsOpenAddEditProductDialog(false);
        dispatch(showMessage({ message: 'Updated Successfully', variant: 'success' }));
    }

    const handleOpenDeleteConfirmation = (product, setSelectedRows) => {
        setSelectedProduct(product);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedProduct(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        ProductService.delete(selectedProduct.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allProducts);
                const removeIndex = list.map(item => item.id).indexOf(selectedProduct.id);
                list.splice(removeIndex, 1);
                setAllProducts(list);
                setSelectedRowsFunc([])
                handleCloseDeleteConfirmation()
                dispatch(showMessage({ message: 'Deleted Successfully', variant: 'success' }));
            }
        });
    }

    const handleOpenImageViewer = (image) => {
        setCurrentImage(image);
        setIsViewerOpen(true);
    };

    const handleCloseImageViewer = () => {
        setIsViewerOpen(false);
        setTimeout(() => {
            setCurrentImage(0);
        }, 500)

    };

    useEffect(() => {
        ProductService.getAll().then(({ data }) => {
            setAllProducts(data);
        })
    }, [])

    return (
        <div className="p-24 w-full">
            <InformationDialog
                open={isOpenConfirmationDialog}
                variant="warning"
                content={tGeneral("delete_record_confirmation")}
                handleConfirm={handleDelete}
                handleClose={handleCloseDeleteConfirmation}
            />
            <AddEditProductDialog
                open={isOpenAddEditProductDialog}
                handleClose={handleCloseAddEditProductDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedProduct={selectedProduct}
            />
            <PreviewProductDialog
                open={isOpenPreviewProductDialog}
                handleClose={handleClosePreviewProductDialog}
                selectedProduct={selectedProduct}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tProduct('TITLE')} desc={tProduct('DESC')} icon="heroicons-outline:color-swatch">
                    <GeneralTable
                        data={allProducts}
                        columns={renderColumns()}
                        title={tProduct('TITLE')}
                        addButtonVisibility={ability.can("ADD", "PRODUCT")}
                        editButtonVisibility={ability.can("EDIT", "PRODUCT")}
                        deleteButtonVisibility={ability.can("DELETE", "PRODUCT")}
                        handleAddClick={handleOpenAddEditProductDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewProductDialog}
                    />
                </PaperBlock>
            </Paper>
            <ImageViewer open={isViewerOpen} handleClose={handleCloseImageViewer} image={currentImage} />
        </div>
    )
}

export default ProductMainPage;