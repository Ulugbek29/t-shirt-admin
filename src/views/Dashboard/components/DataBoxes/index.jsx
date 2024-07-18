import cls from "./style.module.scss"
import React from "react";
import { useCountUp } from "react-countup";

export default function index({data}) {

  // const { number: allUsersCount, update: updateAllUsersCount } = useCountUp({
  //   ref: "counterAllUsers",
  //   start: 0,
  //   end: 0,
  //   duration: 2,
  // });

  return (
    <div className={cls.content__box} style={{background: data.color}}>
    <div className={cls.titleBox}>
      <span>{data.title}</span>
      {data.count && (
      <span className={cls.title__count}>x{data.count}</span>
      )}
    </div>
      <h3>{data.value}</h3>
    </div>
  );
}
