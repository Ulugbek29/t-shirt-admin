import React, { useEffect, useState } from "react";
import CardContent from "../../../../components/common/CardContent";
import {
  AreaChart, Area,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import RangePicker from "../../../../components/common/RangePicker";
import { addDays, format, isWithinInterval, lastDayOfMonth } from 'date-fns';

export default function index({ orders }) {
  const [chartData, setChartData] = useState([]);
  const currentDate = new Date();
   const [state, setState] = useState([
    {
      startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
      key: 'selection'
    }
  ]);




  // Function to filter orders by selected date range and calculate order type count for each day
  const filterAndCountOrders = (orders, startDate, endDate) => {
    const result = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const ordersInDate = orders.filter(order => isWithinInterval(new Date(order.created_at), { start: currentDate, end: addDays(currentDate, 1) }));
      const deliveryCount = ordersInDate.filter(order => order.order_type === "delivery").length;
      const pickupCount = ordersInDate.filter(order => order.order_type === "pickup").length;
      result.push({
        name: format(currentDate, "do MMM"),
        Delivery: deliveryCount,
        Pickup: pickupCount,
        Total: deliveryCount + pickupCount,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }

  // Fetch data from API or set orders directly if available
  useEffect(() => {
    // For demonstration purpose, setting orders directly
    const filteredOrders = orders.filter(order =>{
     return isWithinInterval(new Date(order.created_at), { start: state[0].startDate, end: state[0].endDate })
    } );
    const formattedData = filterAndCountOrders(filteredOrders, state[0].startDate, state[0].endDate);
    setChartData(formattedData);
  }, [orders, state]);


  return (
    <CardContent title="Orders" extra={(
      <RangePicker state={state} setState={setState}/>
    )}>
      <ResponsiveContainer width="100%" height={410}>
        <AreaChart
          margin={{
            top: 5,
            right: 0,
            left: -20,
            bottom: 50,
          }}
          data={chartData} // Use chartData state here
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            style={{ fontWeight: "600", fontSize: "14px", lineHeight: "0" }}
            dy={5}
            textAnchor="start"
            interval={0}
            tickCount={10}
            tick={{ angle: 90 }}
          />
          <YAxis
            tickCount={10}
            textAnchor="end"
            style={{ fontWeight: "600", fontSize: "12px", lineHeight: "24px" }}
          />
          <Tooltip />

          {/* <Bar barSize={25} dataKey="Delivery" fill="#82ca7d" />
          <Bar barSize={25} dataKey="Pickup" fill="#83ca1d" />
          <Bar barSize={25} dataKey="Total" fill="#81co4d" /> */}
          <Area type="monotone" dataKey="Pickup" stackId="1" stroke="#FEB019" fill="#FEB019" />
          <Area type="monotone" dataKey="Delivery" stackId="1" stroke="#00E396" fill="#82E6D9" />
          <Area type="monotone" dataKey="Total" stackId="1" stroke="#008FFB" fill="#9CD4FE" />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
