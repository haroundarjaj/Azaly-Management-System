import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import DashboardHeader from './DashboardHeader';
import reducer from './store';
import HomeTab from './tabs/home/HomeTab';
import widgets from './dumbData';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

function Dashboard(props) {

  if (_.isEmpty(widgets)) {
    return null;
  }

  return (
    <Root
      header={<DashboardHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <HomeTab />
        </div>
      }
    />
  );
}

export default withReducer('projectDashboardApp', reducer)(Dashboard);
