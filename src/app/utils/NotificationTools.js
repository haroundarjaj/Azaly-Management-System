import { showMessage } from 'app/store/fuse/messageSlice';



export const showNotification = (dispatch, message, variant) => {
    dispatch(showMessage({ message, variant }));
}

export const catchServerError = (dispatch, t, err) => {
    if (err.code === "ERR_NETWORK") {
        showNotification(dispatch, t('ERR_NETWORK'), 'error')
    }
}