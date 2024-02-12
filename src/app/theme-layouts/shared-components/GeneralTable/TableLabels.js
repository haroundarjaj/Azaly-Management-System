import { LinearProgress, Typography } from "@mui/material";

export default function getTableLabels(t, laoding) {
    return {
        body: {
            noMatch: laoding ?
                <div className="my-40">
                    <Typography fontWeight={600} color="secondary" variant="subtitle1">{t('loading_data')}</Typography>
                    <LinearProgress color="secondary" />
                </div>
                : t('no_records'),
            toolTip: t('sort'),
            columnHeaderTooltip: column => `${t('sort_for')} ${column.label}`
        },
        pagination: {
            next: t('next_page'),
            previous: t('prev_page'),
            rowsPerPage: t('rows'),
            displayRows: t('of'),
        },
        toolbar: {
            search: t('search'),
            downloadCsv: t('downloadCSV'),
            print: t('print'),
            viewColumns: t('columns'),
            filterTable: t('filter'),
        },
        filter: {
            all: t('all'),
            title: t('title'),
            reset: t('reset'),
        },
        viewColumns: {
            title: t('view_cols'),
            titleAria: t('title_aria'),
        },
        selectedRows: {
            text: t('selected_rows'),
            delete: t('delete'),
            deleteAria: t('delete_selected_rows'),
        },
    }
}