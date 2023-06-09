import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


class GeneralToolbarTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes, tooltip
        } = this.props;
        return (
            <>
                {this.props.printButtonVisibility && (
                    <Tooltip title={'table.print'}>
                        <IconButton onClick={this.props.handlePrintClick}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {this.props.handleExportExcel && (
                    <Tooltip title={'downloadExcel'}>
                        <IconButton onClick={this.props.handleExportExcel}>
                            <GetAppIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {this.props.addButtonVisibility && (
                    <Tooltip title={"add"}>
                        <IconButton onClick={this.props.handleAddClick}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </>
        );
    }
}


GeneralToolbarTable.propTypes = {
    classes: PropTypes.object.isRequired,
    tooltip: PropTypes.string.isRequired,
    addButtonVisibility: PropTypes.bool.isRequired,
    handleAddClick: PropTypes.func.isRequired,
    handleExportExcel: PropTypes.func
};
export default GeneralToolbarTable;
