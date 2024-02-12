import React from 'react';
import { useSpring, animated } from 'react-spring';

function AnimatedNumbers(props) {
    const { start, end, delay } = props;

    const { number } = useSpring({
        from: { number: start },
        number: end,
        delay: delay,
        config: { mass: 1, tension: 20, friction: 10 },
    })

    return <animated.div>{number.to((end) => end.toFixed(0))}</animated.div>
}

export default AnimatedNumbers;