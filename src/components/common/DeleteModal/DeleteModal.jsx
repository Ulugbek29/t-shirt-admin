import * as React from 'react';
import classes from "./style.module.scss"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
};

export default function DeleteModal({openModal,closeErrorModal, deleteTableData}) {


// console.log(openModal.status)
// console.log(openModal.id)
  return (
    <div>
      <Modal
        open={openModal.status}
        onClose={closeErrorModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure that you want to delete?
          </Typography>
          <div className={classes.flex}>
          <Button onClick={closeErrorModal} fullWidth variant="outlined">No</Button>
          <Button onClick={()=> {
            closeErrorModal()
            deleteTableData(openModal.id)
          }} fullWidth variant="contained">yes</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}