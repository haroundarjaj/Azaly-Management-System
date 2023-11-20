import React, { useState } from 'react';
import GenerateOrderStates from './GenerateOrderStates';
import { useTranslation } from 'react-i18next';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon/FuseSvgIcon";
import OrderStateDialog from './OrderStateDialog';

function OrderTimeline(props) {
    const tOrder = useTranslation('ordersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const { order, open, handleClose } = props;

    const [isOpenStateInfo, setIsOpenStateInfo] = useState(false);

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

    const handleOpenStateInfo = () => {
        setIsOpenStateInfo(true);
    }

    const handleCloseStateInfo = () => {
        setIsOpenStateInfo(false);
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" color="secondary">
                        {tOrder('log')}
                    </Typography>
                    <IconButton onClick={handleOpenStateInfo} className="mx-8" size="large">
                        <FuseSvgIcon>heroicons-outline:information-circle</FuseSvgIcon>
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>
                <OrderStateDialog
                    open={isOpenStateInfo}
                    handleClose={handleCloseStateInfo}
                />
                <Timeline position="alternate">
                    {console.log(GenerateOrderStates(tOrder))}
                    {GenerateOrderStates(tOrder).map(state => (
                        <TimelineItem>
                            <TimelineOppositeContent>
                                {order ? order[state.dateName] : ''}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ backgroundColor: state.color }} />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent color={state.color}>{state.name}</TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default OrderTimeline;