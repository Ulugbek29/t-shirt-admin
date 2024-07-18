import classes from "./style.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonsPopover from "../../components/ButtonsPopover";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import productService from "../../services/productsService";
import { pageToOffset } from "../../utils/pageToOffset";
import DeleteModal from "../../components/common/DeleteModal/DeleteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import noImage from "/no-photo-available.png"


const PositionsTable = () => {
  const navigate = useNavigate();
const queryClient = useQueryClient()

  //Pagination 
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //Modal
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
        const calculatedIndex = (currentPage - 1) * rowsPerPage + index + 1;
        return <p>{calculatedIndex}</p>;
      },
    },
    {
      key: "image",
      title: "Image",
      width: "100px",
      render: (itemObj) => {
       return (
        <>
            <img
            src={itemObj.photo_url ? itemObj.photo_url[0] : noImage }
            className={classes.image}
            alt="Product-image"
          />
        </>
      )
      },
    },
    { key: "name", title: "Name" },
    { key: "price", title: "Price" },
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
      title: 'Actions',
      width: "50px",
      render: (itemObj) => (
        <ButtonsPopover
          id={itemObj.id}
          onEditClick={navigateToEditForm}
          setOpenModal={setOpenModal}
        />
      ),
    },
  ];

  
  const fetchProductData = async() => {
   const response = await productService.getList({
      limit: rowsPerPage,
      offset: pageToOffset(currentPage, rowsPerPage),
    })
    setPageCount(Math.ceil(response?.count / rowsPerPage));
    return response.products
  }
  
  
  
  const deleteTableData = (id) => {
    return productService.delete(id)
  }


  const {data: products, isLoading} = useQuery({
    queryKey: ["products", currentPage, rowsPerPage],
    queryFn: fetchProductData,
    staleTime: 3000,
    keepPreviousData: true,
    retry: 5
  }) 



  const {mutate: deleteProducts, status: deleteStatus} = useMutation({
    mutationFn: deleteTableData,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  })


  const handleDelete = (id) => {
    deleteProducts(id);
    closeErrorModal();
  };


  // Navigate to the Edit page
  const navigateToEditForm = (id) => {
    navigate(`/products/${id}`);
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
        setPageCount={setPageCount}
        setRowsPerPage={setRowsPerPage}
        setCurrentPage={setCurrentPage}
        count={pageCount}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        columnsCount={columns.length}
        loader={isLoading}
      >
        <CTableHead>
          <CTableHeadRow>
            {columns.map((column) => {
              return <CTableCell key={column.key}>{column.title}</CTableCell>;
            })}
          </CTableHeadRow>
        </CTableHead>
        <CTableBody
          loader={isLoading}
          columnsCount={columns.length}
          dataLength={products?.length || 0}
        >
          {products?.map((data, index) => (
            <>
              <CTableRow
                key={data.id}
                // onClick={() => navigate(`/projects/${data.id}/backlog`)}
              >
                {columns.map((column) => {
                  return (
                    <CTableCell 
                    onClick={()=>navigateToCell(data, column)}
                    style={{ width: column.width }} 
                    key={column.id}>
                      {column.render
                        ? column.render(data, index)
                        : data[column.key]}
                    </CTableCell>
                  );
                })}
              </CTableRow>
            </>
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
};

export default PositionsTable;
