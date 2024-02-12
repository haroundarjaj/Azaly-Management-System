import React, { useState } from 'react';
import MUIDataTable from "mui-datatables";
import classNames from 'classnames';
import { exportAsExcel } from 'src/app/utils/exportAsExcel';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Visibility } from '@material-ui/icons';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import en from './i18n/en';
import ar from './i18n/ar';
import fr from './i18n/fr';
import getTableLabels from './TableLabels';

i18next.addResourceBundle('en', 'generalTable', en);
i18next.addResourceBundle('ar', 'generalTable', ar);
i18next.addResourceBundle('fr', 'generalTable', fr);

const styles = theme => ({
    table: {
        '& > div': {
            overflow: 'auto'
        },
        '& table': {
            '& td': {
                wordBreak: 'keep-all'
            },
            [theme.breakpoints.down('md')]: {
                '& td': {
                    height: 60,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }
            }
        }
    },
    toolbarBtn: {
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    hideToolBar: {
        '& .MuiToolbar-root': {
            display: 'none'
        }
    }
});

function GeneralTable(props) {
    const {
        classes,
        title,
        data,
        columns,
        loading,
        addButtonVisibility,
        handleAddClick,
        previewButtonVisibility,
        handlePreviewClick,
        editButtonVisibility,
        handleEditClick,
        deleteButtonVisibility,
        handleDeleteClick,
        showToolBar,
        selectableRows
    } = props;

    const { t } = useTranslation('generalTable');

    const options = {
        filter: true,
        fixedHeader: true,
        selectableRows: selectableRows,
        filterType: 'dropdown',
        responsive: 'simple',
        print: true,
        rowsPerPage: 5,
        elevation: 0,
        rowsPerPageOptions: [5, 10, 25, 100],
        page: 0,
        downloadOptions: {
            filename: title + '.csv'
        },
        onDownload: (buildHead, buildBody, columns, data) => '\uFEFF' + buildHead(columns).replaceAll('"', '') + buildBody(data).replaceAll('"', ''),
        draggableColumns: {
            enabled: true,
            transitionTime: 300
        },
        print: true,
        download: true,
        downloadOptions: {
            filename: title + '.csv'
        },
        textLabels: getTableLabels(t, loading),
        customToolbar: () => (
            <>
                <Tooltip title={t("download_excel")} className={classes.toolbarBtn}>
                    <IconButton onClick={() => exportAsExcel(data, title, columns)}>
                        <GetAppIcon />
                    </IconButton>
                </Tooltip>
                {addButtonVisibility && (
                    <Tooltip title={t("add")} className={classes.toolbarBtn}>
                        <IconButton onClick={handleAddClick}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </>
        ),
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
            const dataIndex = selectedRows.data.map(selectedRow => selectedRow.dataIndex);
            const elements = [];
            if (dataIndex.length > 0) {
                for (let i = 0; i < dataIndex.length; i++) {
                    elements.push(data[dataIndex[i]]);
                }
            }
            return (
                <div style={{ paddingRight: 10 }}>
                    {elements?.length === 1
                        ? (
                            <>
                                {previewButtonVisibility && (
                                    <Tooltip title={t("preview")} className={classes.toolbarBtn}>
                                        <IconButton onClick={() => {
                                            handlePreviewClick(elements[0]);
                                        }}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {editButtonVisibility && (
                                    <Tooltip title={t("edit")} className={classes.toolbarBtn}>
                                        <IconButton onClick={() => {
                                            handleEditClick(elements[0]);
                                        }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}

                            </>
                        ) : null
                    }
                    {deleteButtonVisibility && (
                        <Tooltip title={t("delete")} className={classes.toolbarBtn}>
                            <IconButton onClick={() => {
                                handleDeleteClick(elements[0], setSelectedRows);
                            }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    }
                </div>
            );
        },
    };


    return (
        <div
            className={showToolBar ? classNames(classes.table) : classNames(classes.table, classes.hideToolBar)}
        >
            <MUIDataTable
                // title={title}
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    );
}

GeneralTable.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    addButtonVisibility: PropTypes.bool.isRequired,
    handleAddClick: PropTypes.func.isRequired,
    previewButtonVisibility: PropTypes.bool.isRequired,
    handlePreviewClick: PropTypes.func.isRequired,
    editButtonVisibility: PropTypes.bool.isRequired,
    handleEditClick: PropTypes.func.isRequired,
    deleteButtonVisibility: PropTypes.bool.isRequired,
    handleDeleteClick: PropTypes.func.isRequired,
    showToolBar: PropTypes.bool.isRequired,
    selectableRows: PropTypes.string.isRequired
}

GeneralTable.defaultProps = {
    title: '',
    data: [],
    columns: [],
    loading: false,
    addButtonVisibility: true,
    handleAddClick: () => { },
    previewButtonVisibility: true,
    handlePreviewClick: () => { },
    editButtonVisibility: true,
    handleEditClick: () => { },
    deleteButtonVisibility: true,
    handleDeleteClick: () => { },
    showToolBar: true,
    selectableRows: 'single'
}


export default withStyles(styles)(GeneralTable);