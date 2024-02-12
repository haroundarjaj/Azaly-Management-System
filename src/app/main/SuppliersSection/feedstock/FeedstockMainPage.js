import GeneralTable from "app/theme-layouts/shared-components/GeneralTable/GeneralTable";
import { useTranslation } from 'react-i18next';
import AddEditFeedstockDialog from "./AddEditFeedstockDialog";
import { useContext, useEffect, useState } from "react";
import FeedstockService from "src/app/services/FeedstockService";
import { Avatar, Paper } from "@mui/material";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from "react-redux";
import PaperBlock from "app/theme-layouts/shared-components/PaperBlock/PaperBlock";
import InformationDialog from "app/theme-layouts/shared-components/InformationDialog.js/InformationDialog";
import PreviewFeedstockDialog from "./PreviewFeedstockDialog";
import ImageViewer from "app/theme-layouts/shared-components/ImageViewer/ImageViewer";
import { AbilityContext } from "src/app/auth/Can";

let setSelectedRowsFunc = null;

function FeedstockMainPage(props) {
    const tFeedstock = useTranslation('feedstockPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    console.log(useTranslation('feedstockPage'))

    const [isOpenAddEditFeedstockDialog, setIsOpenAddEditFeedstockDialog] = useState(false);
    const [isOpenPreviewFeedstockDialog, setIsOpenPreviewFeedstockDialog] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [allFeedstock, setAllFeedstock] = useState([]);
    const [selectedFeedstock, setSelectedFeedstock] = useState(null);
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
                label: tGeneral('description'),
                name: 'description'
            },
            {
                label: tFeedstock('price'),
                name: 'unitPrice',
            },
            {
                label: tFeedstock('in_stock'),
                name: 'inStock',
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

    const handleOpenAddEditFeedstockDialog = () => {
        setIsOpenAddEditFeedstockDialog(true);
    }

    const handleCloseAddEditFeedstockDialog = () => {
        setIsOpenAddEditFeedstockDialog(false);
        setSelectedFeedstock(null);
    }

    const handleOpenPreviewFeedstockDialog = (feedstock) => {
        setIsOpenPreviewFeedstockDialog(true);
        setSelectedFeedstock(feedstock);
    }

    const handleClosePreviewFeedstockDialog = () => {
        setIsOpenPreviewFeedstockDialog(false);
    }

    const handleOpenEdit = (feedstock) => {
        setIsOpenAddEditFeedstockDialog(true);
        setSelectedFeedstock(feedstock);
    }

    const handleAddDone = (addedFeedstock) => {
        const list = [].concat(allFeedstock);
        list.push(addedFeedstock);
        setAllFeedstock(list);
        setIsOpenAddEditFeedstockDialog(false);
        dispatch(showMessage({ message: 'Created Successfully', variant: 'success' }));
    }

    const handleUpdateDone = (feedstock) => {
        const list = [].concat(allFeedstock);
        const removeIndex = list.map(item => item.id).indexOf(feedstock.id);
        list.splice(removeIndex, 1, feedstock);
        setAllFeedstock(list);
        setIsOpenAddEditFeedstockDialog(false);
        dispatch(showMessage({ message: 'Updated Successfully', variant: 'success' }));
    }

    const handleOpenDeleteConfirmation = (feedstock, setSelectedRows) => {
        setSelectedFeedstock(feedstock);
        setIsOpenConfirmationDialog(true);
        setSelectedRowsFunc = setSelectedRows;
    }

    const handleCloseDeleteConfirmation = () => {
        setSelectedFeedstock(null);
        setIsOpenConfirmationDialog(false);
    }

    const handleDelete = () => {
        FeedstockService.delete(selectedFeedstock.id).then(({ data }) => {
            if (data) {
                const list = [].concat(allFeedstock);
                const removeIndex = list.map(item => item.id).indexOf(selectedFeedstock.id);
                list.splice(removeIndex, 1);
                setAllFeedstock(list);
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
        FeedstockService.getAll().then(({ data }) => {
            setAllFeedstock(data);
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
            <AddEditFeedstockDialog
                open={isOpenAddEditFeedstockDialog}
                handleClose={handleCloseAddEditFeedstockDialog}
                handleAddDone={handleAddDone}
                handleUpdateDone={handleUpdateDone}
                selectedFeedstock={selectedFeedstock}
            />
            <PreviewFeedstockDialog
                open={isOpenPreviewFeedstockDialog}
                handleClose={handleClosePreviewFeedstockDialog}
                selectedFeedstock={selectedFeedstock}
            />
            <Paper elevation={6} className="p-24">
                <PaperBlock title={tFeedstock('TITLE')} desc={tFeedstock('DESC')} icon="heroicons-outline:color-swatch">
                    <GeneralTable
                        data={allFeedstock}
                        columns={renderColumns()}
                        title={tFeedstock('TITLE')}
                        addButtonVisibility={ability.can("ADD", "FEEDSTOCK")}
                        editButtonVisibility={ability.can("EDIT", "FEEDSTOCK")}
                        deleteButtonVisibility={ability.can("DELETE", "FEEDSTOCK")}
                        handleAddClick={handleOpenAddEditFeedstockDialog}
                        handleEditClick={handleOpenEdit}
                        handleDeleteClick={handleOpenDeleteConfirmation}
                        handlePreviewClick={handleOpenPreviewFeedstockDialog}
                    />
                </PaperBlock>
            </Paper>
            <ImageViewer open={isViewerOpen} handleClose={handleCloseImageViewer} image={currentImage} />
        </div>
    )
}

export default FeedstockMainPage;