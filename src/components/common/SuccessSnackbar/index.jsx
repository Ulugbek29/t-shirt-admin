import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
    return <Slide sx={{bgcolor: "#D4EDDA", color: "#155724", fontSize: "1rem", fontWeight: "600"}} {...props} direction="down"/>;
  }
  
  export default function index({
    open,
    setOpenSnackbar,
    message,
  }) {

    const handleClose = () => {
        setOpenSnackbar(false)
    }

    return (
        <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        message={message}
        key={message}
        autoHideDuration={1500}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      />
    )
  }
  