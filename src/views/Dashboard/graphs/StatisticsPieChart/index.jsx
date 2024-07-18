import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CardContent from "../../../../components/common/CardContent";
// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatisticsPieChart = ({orders}) => {


    const pieChartData = Object.values(
        orders.reduce((acc, order) => {
          const district = order.customer_details.address.district;
        //   console.log(acc[district]);
        //   console.log(acc);
          if (!acc[district]) {
            acc[district] = { name: district, value: 0 };
          }
          acc[district].value++;
          return acc;
        }, {})
      );

    return (
        <CardContent title="Регионы">
        <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
          ))}
        </Pie>
       <Tooltip />
      </PieChart>
        </ResponsiveContainer>
        </CardContent>
  );
};

export default StatisticsPieChart;
