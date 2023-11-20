import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import PurchaseMainPage from './PurchaseMainPage';


const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    bpurchaseBottomWidth: 1,
    bpurchaseStyle: 'solid',
    bpurchaseColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function PurchasesPage(props) {
  return (
    <Root
      header={<></>}
      content={<PurchaseMainPage />}
    />
  );
}

export default PurchasesPage;
