import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';

function PapperBlock(props) {
  const {
    title,
    desc,
    children,
    whiteBg,
    noMargin,
    colorMode,
    overflowX,
    icon
  } = props;
  return (
    <div>
      <Paper className='p-[24] mb-[24] shadow-[0_10px_15px_-5px_rgba(62,57,107,0.07)] ' elevation={0}>
        <div className='flex items-center mb-[28]'>
          <span className='rounded-lg border border-solid border-[#BF8F30] shadow-[0_2px_15px_-5px_#BF8F30] w-[48] h-[48]text-center leading-[44px] align-middle flex justify-center items-center'>
            <FuseSvgIcon
              color="secondary"
              size={25}
            >
              {icon}
            </FuseSvgIcon>
          </span>
          <div className='flex-1'>
            <Typography variant="h6" component="h2" className='relative text-[24] font-normal text-[#BF8F30] mx-[24]'>
              {title}
            </Typography>
            <Typography component="p" className='max-w-[960] text-[12] font-[250] mx-[theme.spacing(3)];'>
              {desc}
            </Typography>
          </div>
        </div>
        <section className='w-full overflow-x-auto mt-[20] p-[10] rounded-xl'>
          {children}
        </section>
      </Paper>
    </div>
  );
}

PapperBlock.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
  whiteBg: PropTypes.bool,
  colorMode: PropTypes.bool,
  noMargin: PropTypes.bool,
  overflowX: PropTypes.bool,
};

PapperBlock.defaultProps = {
  whiteBg: false,
  noMargin: false,
  colorMode: false,
  overflowX: false,
  icon: 'ion-ios-bookmark-outline'
};

export default PapperBlock;
