import cls from "./style.module.scss";
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
import { pageToOffset } from "../../utils/pageToOffset";
import DeleteModal from "../../components/common/DeleteModal/DeleteModal";
import PeopleIcon from "@mui/icons-material/People";
import customerService from "../../services/customerServices";
import { useCountUp } from "react-countup";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";
import { parseISO, isToday, isThisMonth } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";




export default function UsersTable() {
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const [inputFilter, setInputFilter] = useState("");
  const [searchInputValue] = useDebounce(inputFilter, 500);
  //Pagination
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //Modal
  const [openModal, setOpenModal] = useState({ status: false, id: null });

  const { number: allUsersCount, update: updateAllUsersCount } = useCountUp({
    ref: "counterAllUsers",
    start: 0,
    end: 0,
    duration: 2,
  });

  const { number: topUsersCount, update: updateTopUsersCount } = useCountUp({
    ref: "counterTopUsers",
    start: 0,
    end: 0,
    duration: 2,
  });



  const { number: currentUsersCount, update: updateCurrentUsersCount } =
    useCountUp({
      ref: "counterCurrentUsers",
      start: 0,
      end: 0,
      duration: 2,
    });


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
      key: "name",
      title: "Name",
    },
    { key: "phone", title: "Phone" },
    // { key: "address", title: "Address", render: (itemObj)=> {
    //   return itemObj.address.name
    // } },
    // {
    //   key: "status",
    //   title: "Status",
    //   width: "100px",
    //   render: (itemObj) => {
    //     return (
    //       <span
    //         className={
    //           itemObj.status === "active"
    //             ? cls.active__status
    //             : cls.inactive__status
    //         }
    //       >
    //         {itemObj.status === "active" ? "Active" : "Inactive"}
    //       </span>
    //     );
    //   },
    // },
    {
      key: "actions",
      title: "Actions",
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


  useEffect(() => {
    fetchAllUsers()
  },[])



// Fetch all data
  const fetchCustomerData = async() => {
    const response = await customerService.getList({
       limit: rowsPerPage,
       offset: pageToOffset(currentPage, rowsPerPage),
       search: searchInputValue,
     })
     setPageCount(Math.ceil(response?.count / rowsPerPage));
     return response.customers
   }

   const deleteTableData = (id) => {
    return customerService.delete(id)
  }



   const {data: customers, isLoading} = useQuery({
    queryKey: ["customers", currentPage, rowsPerPage, searchInputValue],
    queryFn: fetchCustomerData,
    staleTime: 3000,
    keepPreviousData: true,
  }) 



  const {mutate: deleteCustomers, status: deleteStatus} = useMutation({
    mutationFn: deleteTableData,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
  })


  const handleDelete = (id) => {
    deleteCustomers(id);
    closeErrorModal();
  };

  // Fetch all data
  // const fetchTableData = () => {
  //   setLoader(true);
  //   customerService
  //     .getList({
  //       limit: rowsPerPage,
  //       offset: pageToOffset(currentPage, rowsPerPage),
  //       search: searchInputValue,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       // updateAllUsersCount(res.count);
  //       // updateCurrentUsersCount(res.count);
  //       // updateTopUsersCount(res.count);
  //       setTableData(res.customers);
  //       setPageCount(Math.ceil(res?.count / rowsPerPage));
  //     })
  //     .finally(() => setLoader(false));
  // };
  
  const fetchAllUsers = () => {
    customerService.getList({})
    .then((res) => {
       // Filter users created today
       const filteredByToday = res.customers.filter((cus) => {
        return isToday(parseISO(cus.created_at));
      });

      // Filter users created within the current month
      const filteredByMonth = res.customers.filter((cus) => {
        return isThisMonth(parseISO(cus.created_at));
      });

      updateAllUsersCount(res.count);
      updateCurrentUsersCount(filteredByToday.length);
      updateTopUsersCount(filteredByMonth.length);
    })
    .catch((err) => console.log(err))
  }

 

  

  // Navigate to the Edit page
  const navigateToEditForm = (id) => {
    navigate(`/customer/${id}`);
  };

  // Filter Customers
  // const searchCustomerFilter = tableData?.filter((customer) => {
  //   return customer.name.toLowerCase().includes(inputFilter.toLowerCase()) ||
  //   customer.phone.includes(inputFilter)
  // });
  // console.log(searchCustomerFilter);



  // Navigate 
 const navigateToCell = (itemObj, colObj) => {
  if(colObj.key === "actions") {
    return
  }else {
    console.log(itemObj.id);
    navigateToEditForm(itemObj.id)
  }
}



  return (
    <>
      <div className={cls.users__list}>
        <div className={cls.user__amount}>
          <div className={cls.flex}>
            <div className={cls.icon__box}>
              <PeopleIcon fontSize="inherit" />
            </div>
            <div className={cls.people__count}>
              <h2 id="counterAllUsers">{allUsersCount}</h2>
              <p>Все пользователи</p>
            </div>
          </div>
        </div>
        <div className={cls.user__amount}>
          <div className={cls.flex}>
            <div className={cls.icon__box}>
              <PeopleIcon fontSize="inherit" />
            </div>
            <div className={cls.people__count}>
              <h2 id="counterTopUsers">{topUsersCount}</h2>
              <p>Пользователи месяца</p>
            </div>
          </div>
        </div>
        <div className={cls.user__amount}>
          <div className={cls.flex}>
            <div className={cls.icon__box}>
              <PeopleIcon fontSize="inherit" />
            </div>
            <div className={cls.people__count}>
              <h2 id="counterCurrentUsers">{currentUsersCount}</h2>
              <p>Текущие пользователи</p>
            </div>
          </div>
        </div>
      </div>

      <div className={cls.customers__table}>
        <div className={cls.search__customer__input}>
          <TextField
            id="input-with-icon-textfield"
            // label="TextField"
            placeholder="Search customer or order number..."
            fullWidth
            value={inputFilter}
            onChange={(e) => setInputFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>
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
            dataLength={customers?.length || 0}
          >
            {customers?.map((data, index) => (
              <>
                <CTableRow
                  key={data.id}
                  // onClick={() => navigate(`/projects/${data.id}/backlog`)}
                >
                  {columns.map((column) => {
                    return (
                      <CTableCell
                        style={{ width: column.width }}
                        onClick={()=>navigateToCell(data, column)}
                        key={column.id}
                      >
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
      </div>

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
