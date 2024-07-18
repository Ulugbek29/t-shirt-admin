import React, { useState } from "react";
import cls from "./style.module.scss";
import Popover from "@mui/material/Popover";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

export default function ShowMorePagination({
  rowsPerPage,
  count,
  setRowsPerPage = () => {},
  setCurrentPage = () => {},
  setPageCount = () => {},
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleRowsPerPageChange = (value) => {
    const newRowsPerPage = parseInt(value);
    const newPageCount = Math.ceil((count * rowsPerPage) / newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to the first page
    setPageCount(newPageCount);
    handleClose();
  };

  const handleClickPopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <button className={cls.showMore__btn} onClick={handleClickPopup} {...props}><NoteAddIcon color="inherit"/>Show by: {rowsPerPage} {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon />}</button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {[10, 25, 50].map((pageSize) => {
          return (
            <div
              onClick={() => {
                handleRowsPerPageChange(pageSize);
              }}
              className={`${cls.option} ${
                rowsPerPage === pageSize ? cls.active__option : ""
              }`}
              key={pageSize}
            >
              {pageSize}
            </div>
          );
        })}
      </Popover>
    </>
  );
}
