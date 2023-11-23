import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FeedstockMainPage from './FeedstockMainPage';


const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function FeedstockPage(props) {
  return (
    <Root
      header={<></>}
      content={<FeedstockMainPage />}
    />
  );
}

export default FeedstockPage;
