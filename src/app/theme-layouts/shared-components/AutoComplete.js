import { Popper } from "@mui/material";
import { Autocomplete } from "@mui/material";

function AutoComplete(props) {
    return (
        <Autocomplete
            {...props}
            PopperComponent={({ style, ...props }) => (
                <Popper
                    {...props}
                    style={{ ...style, zIndex: 99999 }} // width is passed in 'style' prop
                />
            )}
        />
    )
}

export default AutoComplete;