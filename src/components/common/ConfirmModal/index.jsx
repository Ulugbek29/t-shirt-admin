import React from 'react';
import cls from "./style.module.scss"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const LogoutModal = ({ open, handleClose, handleLogout }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
    <div className={cls.confirm__modal}>
      <h2 className={cls.modal__title}>Confirm Logout</h2>
      <p className={cls.modal__description}>
        Are you sure you want to log out?
      </p>
      <div className={cls.button__box}>
        <Button onClick={handleClose} variant="outlined" color="primary" sx={{width: "100%", fontSize: "1rem"}} size='large'>
          Cancel
        </Button>
        <Button onClick={handleLogout} variant="contained" color="primary" sx={{width: "100%", fontSize: "1rem"}} size='large'>
          Logout
        </Button>
      </div>
    </div>
    </Dialog>
  );
};

const YourComponent = ({open,handleLogout,handleClose}) => {
 
  return (
    <div>
      <LogoutModal open={open} handleClose={handleClose} handleLogout={handleLogout} />
    </div>
  );
};

export default YourComponent;
