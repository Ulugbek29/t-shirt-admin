import React, { useState, useEffect } from "react";
import classes from "./style.module.scss";

import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import categoryService from "../../services/categoryServices";
import ButtonsPopover from "../../components/ButtonsPopover";
import { pageToOffset } from "../../utils/pageToOffset";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../components/common/DeleteModal/DeleteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function CustomPaginationActionsTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [openModal, setOpenModal] = useState({ status: false, id: null });
  const closeErrorModal = () => {
    setOpenModal((prev) => ({ ...prev, status: false }));
  };


  const columns = [
    {
      key: "id",
      title: "№",
      width: "50px",
      render: (itemObj, index) => {
      const calculatedIndex = (currentPage - 1) * rowsPerPage+index+1
     return <p>{calculatedIndex}</p>
    },
    },
    {
      key: "image",
      title: "Photo",
      width: "100px",
      render: (itemObj) => (
        <img
          src={itemObj.photo_url}
          className={classes.categoryImage}
          alt="Category"
        />
      ),
    },
    { key: "name", title: "Name" },
    { key: "description", title: "Description" },
    {
      key: "status",
      title: "Status",
      width: "100px",
      render: (itemObj) => {
        return (
          <span
            className={
              itemObj.status === "active"
                ? classes.active__status
                : classes.inactive__status
            }
          >
            {itemObj.status === "active" ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "50px",
      render: (itemObj) => (
        <ButtonsPopover
          id={itemObj.id}
          onEditClick={navigateToEditForm}
          setOpenModal={setOpenModal}
          // onDeleteClick={deleteTableData}
        />
      ),
    },
  ];

 


// Get all Categories
  const fetchCategoryList = async() => {
    const response = await categoryService.getList({
       limit: rowsPerPage,
       offset: pageToOffset(currentPage, rowsPerPage),
     })
     setPageCount(Math.ceil(response?.count / rowsPerPage));
     return response.categories
   }

   // Delete category
   const deleteTableData = (id) => {
    return categoryService.delete(id)
  }

   const {data: categories, isLoading} = useQuery({
    queryKey: ["categories", currentPage, rowsPerPage],
    queryFn: fetchCategoryList,
    staleTime: 3000,
    keepPreviousData: true,
  }) 
console.log(categories);

  const {mutate: deleteCategories, status: deleteStatus} = useMutation({
    mutationFn: deleteTableData,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  })

  const handleDelete = (id) => {
    deleteCategories(id);
    closeErrorModal();
  };

  // Navigate to edit form
  const navigateToEditForm = (id) => {
    navigate(`/category/${id}`);
  };


 // Navigate 
 const navigateToCell = (itemObj, colObj) => {
  if(colObj.key === "actions") {
    return
  }else {
    navigateToEditForm(itemObj.id)
  }
}

  return (
    <>
      <CTable
        count={pageCount}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        columnsCount={columns.length}
        setPageCount={setPageCount}
        setRowsPerPage={setRowsPerPage}
        setCurrentPage={setCurrentPage}
        loader={isLoading}
      >
        <CTableHead>
          <CTableHeadRow>
            {columns.map((col) => (
              <CTableCell  key={col.key} >
                {col.title}
              </CTableCell>
            ))}
          </CTableHeadRow>
        </CTableHead>
        <CTableBody
          loader={isLoading}
          columnsCount={columns.length}
          dataLength={categories?.length || 0} 
        >
          {categories?.map((row, i) => (
            <CTableRow key={i}>
              {columns?.map((column, j) => (
                <CTableCell
                  style={{ width: column.width }}
                  onClick={()=>navigateToCell(row, column)}
                  key={j}
                >
                  {column.render ? column.render(row, i) : row[column.key]}
                </CTableCell>
              ))}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {openModal.status && (
        <DeleteModal
          openModal={openModal}
          closeErrorModal={closeErrorModal}
          deleteTableData={handleDelete}
        />
      )}
    </>
  );
}
