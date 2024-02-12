import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { widgets } from '../../../dumbData';
import OrderService from 'src/app/services/OrderService';
import ChartData from './ChartWidgetData';
import PurchaseService from 'src/app/services/PurchaseService';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

function FinancialChartWidget() {
  const theme = useTheme();
  const tDashboard = useTranslation('dashboard').t;
  const tGeneral = useTranslation('generalTranslations').t;

  const [awaitRender, setAwaitRender] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [gainsData, setGainsData] = useState([]);
  const [costsData, setCostsData] = useState([]);
  const { series, ranges, labels } = ChartData(tGeneral, tDashboard);
  const currentRange = Object.keys(ranges)[tabValue];



  const chartOptions = {
    chart: {
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'line',
      style: {
        direction: 'rtl'
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.secondary.main, theme.palette.primary.main],
    labels: i18next.dir() === 'rtl' ? [...labels[currentRange]].reverse() : labels[currentRange],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1],
      background: {
        borderWidth: 0,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.75,
        },
      },
    },
    stroke: {
      width: [3, 2],
    },
    tooltip: {
      followCursor: true,
      theme: theme.palette.mode,
    },
    xaxis: {
      opposite: i18next.dir() === 'rtl',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: theme.palette.divider,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      opposite: i18next.dir() === 'rtl',
      labels: {
        offsetX: -16,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };

  const generateSeries = () => {
    const seriesList = series[currentRange];
    seriesList[0] = { ...seriesList[0], data: gainsData };
    seriesList[1] = { ...seriesList[1], data: costsData };

    return i18next.dir() === 'rtl' ? seriesList.map(s => ({ ...s, data: [...s['data']].reverse() })) : seriesList
  }

  let fetchGains = null;
  let fetchCosts = null;

  const fetchData = () => {
    console.log(currentRange)
    switch (currentRange) {
      case 'this-week':
        fetchGains = OrderService.getThisWeekGainsStatistics();
        fetchCosts = PurchaseService.getThisWeekCostsStatistics();
        break;
      case 'this-month':
        fetchGains = OrderService.getThisMonthGainsStatistics();
        fetchCosts = PurchaseService.getThisMonthCostsStatistics();
        break;
      case 'this-year':
        fetchGains = OrderService.getThisYearGainsStatistics();
        fetchCosts = PurchaseService.getThisYearCostsStatistics();
        break;
    }

    Promise.all([fetchGains, fetchCosts]).then((responses) => {
      console.log(responses)
      setGainsData(responses[0].data);
      setCostsData(responses[1]?.data);
      setAwaitRender(false);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData()
  }, [tabValue]);


  if (awaitRender) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          {tDashboard('financial_statistics')}
        </Typography>
        <div className="mt-12 sm:mt-0 sm:ml-8">
          <Tabs
            value={tabValue}
            onChange={(ev, value) => setTabValue(value)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="-mx-4 min-h-40"
            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: 'text.disabled' }}
                  className="w-full h-full rounded-full opacity-20"
                />
              ),
            }}
          >
            {Object.entries(ranges).map(([key, label]) => (
              <Tab
                className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
                disableRipple
                key={key}
                label={label}
              />
            ))}
          </Tabs>
        </div>
      </div>
      <div >
        <div className="flex flex-col flex-auto">
          <Typography className="font-medium" color="text.secondary">
            {`${tDashboard('gains')} ${tDashboard('vs')}. ${tDashboard('costs')} (${tGeneral('dh')})`}
          </Typography>
          <div className="flex flex-col flex-auto">
            <ReactApexChart
              className="flex-auto w-full"
              options={chartOptions}
              series={generateSeries()}
              height={320}
            />
          </div>
        </div>
        {/* <div className="flex flex-col">
          <Typography className="font-medium" color="text.secondary">
            Overview
          </Typography>
          <div className="flex-auto grid grid-cols-4 gap-16 mt-24">
            <div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-indigo-50 text-indigo-800">
              <Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['new-issues']}
              </Typography>
              <Typography className="mt-4 text-sm sm:text-lg font-medium">New Issues</Typography>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center py-32 px-4 rounded-2xl bg-green-50 text-green-800">
              <Typography className="text-5xl sm:text-7xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['closed-issues']}
              </Typography>
              <Typography className="mt-4 text-sm sm:text-lg font-medium">Closed</Typography>
            </div>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange].fixed}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Fixed</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['wont-fix']}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Won't Fix</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['re-opened']}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Re-opened</Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: (_theme) =>
                  _theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center py-32 px-4 rounded-2xl"
            >
              <Typography className="text-5xl font-semibold leading-none tracking-tight">
                {overview[currentRange]['needs-triage']}
              </Typography>
              <Typography className="mt-4 text-sm font-medium text-center">Needs Triage</Typography>
            </Box>
          </div>
        </div>*/}
      </div>
    </Paper>
  );
}

export default memo(FinancialChartWidget);
