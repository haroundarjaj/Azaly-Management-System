import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { widgets } from '../../../dumbData'
import AnimatedNumbers from 'app/theme-layouts/shared-components/AnimatedNumbers';
import OrderService from 'src/app/services/OrderService';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function GainsWidget() {

  const [monthGains, setMonthGains] = useState(0);
  const [weekGains, setWeekGains] = useState(0);

  const tDashboard = useTranslation('dashboard').t;
  const tGeneral = useTranslation('generalTranslations').t;

  useEffect(() => {
    OrderService.getThisMonthGains().then(({ data }) => {
      setMonthGains(data);
    })
    OrderService.getThisWeekGains().then(({ data }) => {
      setWeekGains(data);
    })
  }, [])

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        <Typography
          className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
          color="text.secondary"
        >
          {`${tDashboard('gains')} (${tGeneral('dh')})`}
        </Typography>
        {/* <IconButton aria-label="more" size="large">
          <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton> */}
      </div>
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-green-500">
          <AnimatedNumbers start={0} end={monthGains} delay={200} />
        </Typography>
        <Typography className="text-lg font-medium text-green-600">{tDashboard('this_month')}</Typography>
      </div>
      <Typography
        className="flex items-baseline justify-center w-full mt-16 mb-20"
        color="text.secondary"
      >
        <span className="truncate">{tDashboard('this_week')}</span>:
        <b className="px-8">{weekGains}</b>
      </Typography>
    </Paper>
  );
}

export default memo(GainsWidget);
