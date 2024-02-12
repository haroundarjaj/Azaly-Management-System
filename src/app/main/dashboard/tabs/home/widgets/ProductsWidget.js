import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { widgets } from '../../../dumbData'
import AnimatedNumbers from 'app/theme-layouts/shared-components/AnimatedNumbers';
import ProductService from 'src/app/services/ProductService';
import ProductCategoryService from 'src/app/services/ProductCategoryService';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ProductsWidget() {

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const tProduct = useTranslation('productsPage').t;

  useEffect(() => {
    ProductService.countAllProducts().then(({ data }) => {
      setTotalProducts(data);
    })
    ProductCategoryService.countAllCategories().then(({ data }) => {
      setTotalCategories(data);
    })
  }, [])

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-12">
        <Typography
          className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
          color="text.secondary"
        >
          {tProduct('TITLE')}
        </Typography>
        {/* <IconButton aria-label="more" size="large">
          <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
        </IconButton> */}
      </div>
      <div className="text-center mt-8">
        <Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-amber-500">
          <AnimatedNumbers start={0} end={totalProducts} delay={200} />
        </Typography>
        <Typography className="text-lg font-medium text-amber-600">
          {tProduct('TITLE')}
        </Typography>
      </div>
      <Typography
        className="flex items-baseline justify-center w-full mt-16 mb-20"
        color="text.secondary"
      >
        <span className="truncate">{tProduct('categories')}</span>:
        <b className="px-8">{totalCategories}</b>
      </Typography>
    </Paper>
  );
}

export default memo(ProductsWidget);
