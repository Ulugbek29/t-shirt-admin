import cls from "./style.module.scss";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import DataBoxes from "./components/DataBoxes";
import StatisticsBarChart from "./graphs/StatisticsBarChart";
import { calculateTotalPrice } from "../../utils/calculateAllOrders";
import orderServices from "../../services/orderServices";
import { addSpaceForNumbers } from "../../utils/addSpaceForNumbers";
import { Clusterer, Map, Placemark, YMaps } from "react-yandex-maps";
import CardContent from "../../components/common/CardContent";
import { useNavigate } from "react-router-dom";
import TopTenFilteredItems from "../../components/common/TopTenFilteredItems"
import { parseISO, isToday, isThisMonth } from 'date-fns';
import { CTable, CTableBody, CTableCell, CTableHead, CTableHeadRow, CTableRow } from "../../components/CTable";


//   Icons
import PlaceIcon from '@mui/icons-material/Place';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import { useQuery } from "@tanstack/react-query";


export default function DashboardContent() {
  const navigate = useNavigate()
  // const [allOrders, setAllOrders] = useState([]);
  // const [allOrdersCount, setAllOrdersCount] = useState(0);
  // const [todayOrders, setTodayOrders] = useState([])
  // const [monthlyOrders, setMonthlyOrders] = useState([])
  const [graphStatistics, setGraphStatistics] = useState([]);


  // useEffect(() => {
  //   fetchAllOrders();
  // }, []);

  const fetchOrderData = async() => {
    const response = await orderServices.getList({
      limit: 100000,
    });
    return response.orders;
  }



  const { data: allOrders = [], isLoading, isError } = useQuery({
    queryKey: ['ordersList'],
    queryFn: fetchOrderData,
    staleTime: 3000,
    keepPreviousData: true,
});

  const filteredByToday = allOrders.filter((cus) => isToday(parseISO(cus.created_at)));
  const filteredByMonth = allOrders.filter((cus) => isThisMonth(parseISO(cus.created_at)));

  const allOrdersCount = allOrders.length;
  const todayOrders = filteredByToday;
  const monthlyOrders = filteredByMonth;



  // const fetchAllOrders = () => {
  //   orderServices
  //     .getList({
  //       limit: 10000,
  //     })
  //     .then((res) => {
  //       const filteredByToday = res.orders.filter((cus) => {
  //         return isToday(parseISO(cus.created_at));
  //       });
  
  //       // Filter users created within the current month
  //       const filteredByMonth = res.orders.filter((cus) => {
  //         return isThisMonth(parseISO(cus.created_at));
  //       });
  //       setAllOrders(res.orders);
  //       setTodayOrders(filteredByToday)
  //       setMonthlyOrders(filteredByMonth)
  //       setAllOrdersCount(res.count);
  //     })
  //     .catch((err) => console.log(err));
  // };


  const orderPaymentTypes = (paymentType, array) => {
    return array.filter(
      (order) => order.payment_details.payment_type_id === paymentType
    );
  };


  const columns = [
    { key: "id", title: "ID", width: "50px",
    render: (itemObj, index)  =>{
      return index+1
    }
   },
   {key: "name", title: "Name"},
   {key: "phone", title: "Phone number"},
   {key: "count", title: "Total orders"},
  ]

  // Boxes Data
  const boxes = [
    {
      title: "Jami Sotuvlar",
      value: `${addSpaceForNumbers(calculateTotalPrice(allOrders))} UZS`,
      color: "#D7EDFF",
    },
    {
      title: "Buyurtmalar soni",
      value: allOrdersCount,
      color: "#FBCFE8",
    },
    {
      title: "Ortacha buyurtmalar soni",
      value: `${addSpaceForNumbers(
        Math.floor(calculateTotalPrice(allOrders) / allOrdersCount)
      )} UZS`,
      color: "#ECF4FE",
    },
    {
      title: `Naqd pul`,
      value: `${addSpaceForNumbers(
        calculateTotalPrice(
          orderPaymentTypes("8e85e55f-bcd8-4225-9ae9-ec9ded4787ae", allOrders)
        )
      )} UZS`,
      color: "#BBFBD0",
      count: orderPaymentTypes(
        "8e85e55f-bcd8-4225-9ae9-ec9ded4787ae",
        allOrders
      ).length,
    },
    {
      title: "Payme",
      value: `${addSpaceForNumbers(
        calculateTotalPrice(
          orderPaymentTypes("f2868b77-32b2-4f0b-be9f-710741c386d5", allOrders)
        )
      )} UZS`,
      color: "#00CECE",
      count: orderPaymentTypes(
        "f2868b77-32b2-4f0b-be9f-710741c386d5",
        allOrders
      ).length,
    },
    {
      title: "Click",
      value: `${addSpaceForNumbers(
        calculateTotalPrice(
          orderPaymentTypes("d19c17c2-902f-4751-8c34-0e2c8bf20a60", allOrders)
        )
      )} UZS`,
      color:
        "linear-gradient(-45deg, rgba(0,131,247,1) 0%, rgba(0,157,247,1) 50%, rgba(0,197,247,1) 100%)",
      count: orderPaymentTypes(
        "d19c17c2-902f-4751-8c34-0e2c8bf20a60",
        allOrders
      ).length,
    },
    {
      title: "Kunlik sotuv summasi",
      value: `${addSpaceForNumbers(calculateTotalPrice(todayOrders))} UZS`,
      color: "#D78DFF",
    },
    {
      title: "Kunlik buyurtmalar soni",
      value: todayOrders.length,
      color: "#E7EA00",
    },
    {
      title: "Oylik sotuv summasi",
      value:`${addSpaceForNumbers(calculateTotalPrice(monthlyOrders))} UZS`,
      color: "#EF5000",
    },
    {
      title: "Oylik buyurtmalar soni",
      value: monthlyOrders.length,
      color: "#00FC50",
    },
  ];


  //Fetching

 




console.log(allOrders);








  const clusterPoints = allOrders
    .map((order) => {
      const lat = order?.customer_details?.address?.lat;
      const long = order?.customer_details?.address?.long;
      if (lat && long) {
        return {
          customer_id: order.customer_details.id,
          cluster: [long, lat],
          name: order.customer_details.address.name,
          district: order.customer_details.address.district,
        };
      }
      return null; // return null if lat or long is missing
    })
    .filter(Boolean); // filter out null values



    const topTenUsers = 
      allOrders.reduce((acc, order) => {
       const customerId = order.customer_details.id


        const existingCustomer = acc.find((cus) => cus.id === customerId)


        if(existingCustomer) {
          existingCustomer.count += 1
        }else {
          acc.push({
            id: customerId,
            name: order.customer_details.name,
            phone: order.customer_details.phone,
            count: 1
          })
        }

        return acc;
      },[])
      .sort((a, b) => b.count - a.count)
      .slice(0,10)

    const topTenRegions = 
      allOrders.reduce((acc, order) => {
        const district = order.customer_details.address.district
        const address = order.customer_details.address.name


        const existingDistrict = acc.find((dis) => dis.title === district)


        if(existingDistrict) {
          existingDistrict.count += 1
        }else {
          acc.push({
            title: district,
            subtitle:address,
            id: "",
            count: 1,
            icon: PlaceIcon,
            iconColor: "#BE2228",
            color: "purple",
            bgColor: "#ECDFFB"
          })
        }

        return acc;
      },[])
      .sort((a, b) => b.count - a.count)
      .slice(0,10)

     

      const topTenProducts = 
      allOrders
      .flatMap(order => order.order_products.products)
      .filter((order)=> order !== null && order !== undefined)
      .reduce((acc, order) => {
        const productId = order.product_id
       
        const existingProduct = acc.find((pro) => pro.id === productId)


        if(existingProduct) {
          existingProduct.count += 1
        }else {
          acc.push({
            id: order.product_id,
            title: order.product_name,
            subtitle: "",
            count: 1,
            icon: CheckroomIcon,
            iconColor: "#75B7A7",
            color: "green",
            bgColor: "#D1FAE4",
          })
        }

        return acc;
      },[])
      .sort((a, b) => b.count - a.count)
      .slice(0,10)
      



  return (
    <div className={cls.dashboard}>
      <div className={cls.content}>
        <div className={cls.content__boxs}>
          {boxes.map((box, index) => {
            return <DataBoxes key={index} data={box} />;
          })}
        </div>

        <div className={cls.statistics__BarChart}>
          <StatisticsBarChart orders={allOrders} />
        </div>



        <div className={cls.orders__map__container}>
          <CardContent title="Карта заказов по районам">
        <div
          className={cls.order__map}
          style={{ width: "100%", height: "500px" }}
        >
          <YMaps>
            <Map
              // onLoad={(map) => setYmaps(map)}
              width="100%"
              height="100%"
              defaultState={{
                center: [41.311155, 69.2797],
                zoom: 10,
              }}
              modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
            >
              <Clusterer
                options={{
                  preset: "islands#darkGreenClusterIcons", // Customize the cluster color
                  groupByCoordinates: false,
                }}

                onClick={(e) => {
        const cluster = e.get('target');
        if (cluster && cluster.getGeoObjects) {
          const geoObjects = cluster.getGeoObjects();

          // Check if all orders are from the same location
          const firstGeoObject = geoObjects[0];
          const sameLocation = geoObjects.every((obj) => {
            return obj.geometry.getCoordinates().toString() === firstGeoObject.geometry.getCoordinates().toString();
          });
          console.log(firstGeoObject.properties.get('customer_id'))
          if (sameLocation) {
            // Navigate to the first customer in the cluster
            const customerID = firstGeoObject.properties.get('customer_id');
            navigate(`/customer/${customerID}`);
          } else {
            // Handle the case where there are multiple locations
            // You can show a popup with a list of customers here
            console.log('Cluster contains multiple locations');
          }
        }
      }}
              >
                {clusterPoints.map((coordinates, index) => (
                  <Placemark
                    key={index}
                    geometry={coordinates.cluster}
                    onClick={()=> navigate(`/customer/${coordinates.customer_id}`)}
                    properties={{
                      // iconContent: coordinates.name,
                      hintContent: coordinates.name,
                    //   balloonContent: `<div style={{ display: 'flex', flexDirection: 'column' }}>
                    //     <p>Address: ${coordinates.name}</p>
                    //     <p>District: ${coordinates.district}</p>
                    //  </div>`,
                    }}
                    options={{
                      preset: "islands#darkGreenDotIcon",
                    }}
                  />
                ))}
              </Clusterer>
            </Map>
          </YMaps>
        </div>
          </CardContent>

        </div>

        <div className={cls.filtered__items__container}>
          <div className={cls.filterd__box}>
              <TopTenFilteredItems title="Top 10 Regions"  filteredItems={topTenRegions}/>
          </div>

          <div className={cls.filterd__box}>
              <TopTenFilteredItems title="Top 10 Products"  filteredItems={topTenProducts}/>
          </div>
        </div>

        <div className={cls.filtered__tables}>
        <CardContent title="Top 10 Users">
        <CTable
        // count={pageCount}
        // page={currentPage}
        // rowsPerPage={rowsPerPage}
        // setPageCount={setPageCount}
        // setRowsPerPage={setRowsPerPage}
        // setCurrentPage={setCurrentPage}
        disablePagination
        removableHeight={0}
        columnsCount={columns.length}
      >
        <CTableHead>
          <CTableHeadRow>
          {columns.map((col) => (
              <CTableCell key={col.key}>
                {col.title}
              </CTableCell>
            ))}
          </CTableHeadRow>
        </CTableHead>
        <CTableBody
          // loader={loader}
          columnsCount={columns.length}
          dataLength={topTenUsers?.length || 0}
        >
          {topTenUsers?.map((row, i) => (
            <CTableRow key={row.key}>
              {columns?.map((column) => (
                <CTableCell key={column.key} style={{ width: column.width, height: "100%" }}>
                  {column.render ? column.render(row, i) : row[column.key]}
                </CTableCell>
              ))}
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
        </CardContent>
        </div>

      </div>
    </div>
  );
}
