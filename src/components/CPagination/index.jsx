import { Pagination } from "@mui/material";
import { withStyles } from "@mui/styles";
import ShowMorePagination from "../common/ShowMoreButton/ShowMorePagination";


const StyledPagination = withStyles((theme) => ({
  root: {
    '& .Mui-selected:hover': {
      backgroundColor: theme.palette.primary.main, // Change background color on hover
      color: theme.palette.primary.contrastText, // Change text color on hover
    },
  },
}))(Pagination);



const CPagination = ({
  setCurrentPage = () => {},
  setRowsPerPage = () => {},
  setPageCount = () => {},
  rowsPerPage,
  count,
  ...props
}) => {

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px",
      }}
    >
      <ShowMorePagination
        type="button"
        rowsPerPage={rowsPerPage}
        count={count}
        setRowsPerPage={setRowsPerPage}
        setCurrentPage={setCurrentPage}
        setPageCount={setPageCount}
      />
      <StyledPagination
        color="pagination"
        onChange={(e, val) => {
          setCurrentPage(val);
        }}
        count={count}
        {...props}
      />
    </div>
  );
};

export default CPagination;
