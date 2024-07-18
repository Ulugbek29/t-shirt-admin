import "./style.scss";
// import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"
import { Card, CircularProgress, IconButton, Popover } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useId, useState } from "react";

const ButtonsPopover = ({
  id,
  onEditClick = () => {},
  onDeleteClick = () => {},
  activeEyeButton,
  buttonProps,
  loading,
  openModal = () => {},
  orientation = "vertical",
  className,
  setOpenModal,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} {...buttonProps} />
      </IconButton>
    );

  return (
    <div onClick={(e) => e.stopPropagation()} className={className}>
      <IconButton color="primary" {...buttonProps} onClick={handleClick}>
        {orientation === "vertical" ? <MoreVertIcon /> : <MoreHorizIcon />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Card elevation={12} className="ButtonsPopover">
          {activeEyeButton && (
            <IconButton
              color="primary"
              onClick={(e) => {
                handleClose();
                openModal(e, id);
              }}
            >
              <RemoveRedEyeIcon />
            </IconButton>
          )}
          {onEditClick && (
            <IconButton
              className="IconButtonBox"
              color="success"
              onClick={(e) => {
                handleClose();
                onEditClick(id);
              }}
            >
              <EditIcon className="IconButton" />
            </IconButton>
          )}
          <IconButton
            className="IconButtonBox"
            color="error"
            onClick={(e) => {
              handleClose();
              setOpenModal((prev)=> ({status: !prev.status , id: id}))
              // onDeleteClick(e, id);
            }}
          >
            <DeleteIcon className="IconButton" />
          </IconButton>
        </Card>
      </Popover>
    </div>
  );
};

export default ButtonsPopover;
