import { Dialog, DialogContent } from "@material-ui/core";
import { Button } from "@mui/material";

function ImageViewer(props) {
    const { open, handleClose, image } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullWidth
            maxWidth="xl"
            style={{ zIndex: 20000 }}
        >
            <div className="flex justify-center items-center">
                <img src={image} alt="logo" style={{ maxWidth: "100%", maxHeight: "90vh" }} />
            </div>
            <Button onClick={handleClose} className="fixed right-[0] top-[0] mt-10 mr-16 text-white text-lg font-medium">X</Button>
        </Dialog>
    )
}

export default ImageViewer;