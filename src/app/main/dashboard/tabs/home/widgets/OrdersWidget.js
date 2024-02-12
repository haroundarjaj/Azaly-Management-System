import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { widgets } from '../../../dumbData'
import { useEffect } from 'react';
import OrderService from 'src/app/services/OrderService';
import AnimatedNumbers from 'app/theme-layouts/shared-components/AnimatedNumbers';
import { useTranslation } from 'react-i18next';

function OrdersWidget() {
  // const { data, ranges, currentRange: currentRangeDefault } = widgets?.summary;

  // const [currentRange, setCurrentRange] = useState(currentRangeDefault);

  // function handleChangeRange(ev) {
  //   setCurrentRange(ev.target.value);
  // }

  const tOrder = useTranslation('ordersPage').t;

  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);

  useEffect(() => {
    OrderService.countAll().then(({ data }) => {
      setTotalOrders(data);
    })
    OrderService.countDelivered().then(({ data }) => {
      setDeliveredOrders(data);
    })
  }, [])

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        {/* <Select
          className="mx-16"
          classes={{ select: 'py-0 flex items-center' }}
          value={currentRange}
          onChange={handleChangeRange}
          inputProps={{
            name: 'currentRange',
          }}
          variant="filled"
          size="small"
        >
          {Object.entries(ranges).map(([key, n]) => {
            return (
              <MenuItem key={key} value={key}>
                {n}
              </MenuItem>
            );
          })}
        </Select> */}
        <Typography
          className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
          color="text.secondary"
        >
          {tOrder('TITLE')}
        </Typography>
        {/* <IconButton aria-label="more" size="large">
          <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton> */}
      </div>
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500">
          {/* {data.count[currentRange]} */}
          {/* {totalOrders} */}
          <AnimatedNumbers start={0} end={totalOrders} delay={200} />
        </Typography>
        <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">
          {tOrder('TITLE')}
        </Typography>
      </div>
      <Typography
        className="flex items-baseline justify-center w-full mt-16 mb-20"
        color="text.secondary"
      >
        <span className="truncate">{tOrder('delivered')}</span>:
        {/* <b className="px-8">{data.extra.count[currentRange]}</b> */}
        <b className="px-8">{deliveredOrders}</b>
      </Typography>
    </Paper>
  );
}

export default memo(OrdersWidget);
