import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditCategoryDialog from "./AddEditCategoryDialog";
import { useContext, useEffect, useState } from "react";
import CategoryService from "src/app/services/ProductCategoryService";
import { Avatar, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewCategoryDialog from "./PreviewCategoryDialog";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import { AbilityContext } from "src/app/auth/Can";

let setSelectedRowsFunc = null;

function CategoryMainPage(props) {
    const tCategory = useTranslation('categoriesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const [isOpenAddEditCategoryDialog, setIsOpenAddEditCategoryDialog] = useState(false);
    const [isOpenPreviewCategoryDialog, setIsOpenPreviewCategoryDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const dispatch = useDispatch();
    const ability = useContext(AbilityContext);


    const renderColumns = () => {
        return [
            {
                label: tGeneral('name'),
                name: 'name',
            },
            {
                label: tGeneral('description'),
                name: 'description',
                options: {
                    filter: false,
                }
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

    const handleOpenAddEditCategoryDialog = () => {
        setIsOpenAddEditCategoryDialog(true);
    }

    const handleCloseAddEditCategoryDialog = () => {
        setIsOpenAddEditCategoryDialog(false);
        setSelectedCategory(null);
    }

    const handleOpenPreviewCategoryDialog = (category) => {
        setIsOpenPreviewCategoryDialog(true);
        setSelectedCategory(category);
    }

    const handleClosePreviewCategoryDialog = () => {
        setIsOpenPreviewCategoryDialog(false);
    }

    const handleOpenEdit = (category) => {
        setIsOpenAddEditCategoryDialog(true);
        setSelectedCategory(category);
    }

    const handleShowNotification = (message, variant) => {
        dispatch(showMessage({ message, variant }));
    }

    const handleAddDone = (addedCategory) => {
        const list = [].concat(allCategories);
        list.push(addedCategory);
        setAllCategories(list);
        setIsOpenAddEditCategoryDialog(false);
        handleShowNotification('Created Successfully', 'success');
    }

    const handleUpdateDone = (category) => {
        const list = [].concat(allCategories);
        const removeIndex = list.map(item => item.id).indexOf(category.id);
        list.splice(removeIndex, 1, category);
        setAllCategories(list);
        setIsOpenAddEditCategoryDialog(false);
        handleShowNotification('Updated Successfully', 'success');
    }

    const handleOpenDeleteConfirmation = (category, setSelectedRows) => {
        setSelectedCategory(category);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedCategory(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        CategoryService.delete(selectedCategory.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allCategories);
                const removeIndex = list.map(item => item.id).indexOf(selectedCategory.id);
                list.splice(removeIndex, 1);
                setAllCategories(list);
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
        CategoryService.getAll().then(({ data }) => {
            setAllCategories(data);
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
            <AddEditCategoryDialog
                open={isOpenAddEditCategoryDialog}
                handleClose={handleCloseAddEditCategoryDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedCategory={selectedCategory}
                handleShowNotification={handleShowNotification}
            />
            <PreviewCategoryDialog
                open={isOpenPreviewCategoryDialog}
                handleClose={handleClosePreviewCategoryDialog}
                selectedCategory={selectedCategory}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tCategory('TITLE')} desc={tCategory('DESC')} icon="heroicons-outline:view-boards">
                    <GeneralTable
                        data={allCategories}
                        columns={renderColumns()}
                        title={tCategory('TITLE')}
                        addButtonVisibility={ability.can("ADD", "PRODUCT_CATEGORY")}
                        editButtonVisibility={ability.can("EDIT", "PRODUCT_CATEGORY")}
                        deleteButtonVisibility={ability.can("DELETE", "PRODUCT_CATEGORY")}
                        handleAddClick={handleOpenAddEditCategoryDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewCategoryDialog}
                    />
                </PaperBlock>
            </Paper>
            <ImageViewer open={isViewerOpen} handleClose={handleCloseImageViewer} image={currentImage} />
        </div>
    )
}

export default CategoryMainPage;