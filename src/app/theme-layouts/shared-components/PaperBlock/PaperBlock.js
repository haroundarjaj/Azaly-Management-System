import React from 'react';
import PropTypes from 'prop-types';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon';
import { Typography } from '@mui/material';

function PaperBlock(props) {
    const {
        title,
        desc,
        children,
        icon
    } = props;
    return (
        <>
            <div className='flex items-center mb-28'>
                <span className='rounded-lg border border-solid border-[#F1E7D3] shadow-[0_2px_15px_-5px_#BF8F30] w-56 h-56 text-center leading-[44px] align-middle flex justify-center items-center'>
                    <FuseSvgIcon
                        color="secondary"
                        size={28}
                    >
                        {icon}
                    </FuseSvgIcon>
                </span>
                <div className='flex-1'>
                    <Typography variant="h6" component="h2" className='relative text-24 font-normal text-[#BF8F30] mx-24'>
                        {title}
                    </Typography>
                    <Typography component="p" className='max-w-960 text-[12] font-250 mx-24'>
                        {desc}
                    </Typography>
                </div>
            </div>
            <section className='w-full overflow-x-auto mt-[20] p-[10] rounded-xl'>
                {children}
            </section>
        </>
    );
}

PaperBlock.propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.node.isRequired
};

PaperBlock.defaultProps = {
    icon: 'ion-ios-bookmark-outline'
};

export default PaperBlock;
