import cls from "./style.module.scss";
import React from "react";
import CardContent from "../../../components/common/CardContent";




function index({filteredItems, title}) {
  return (
    <CardContent title={title}>
      <div className={cls.filtered__box__wrapper}>
      {filteredItems.length > 0 && filteredItems.map((item, index) => (
        <div className={cls.filtered__box}>
        <div className={cls.content__wrapper}>
        <span
        style={{color: item.iconColor}}
         className={cls.box__icon}>
          <item.icon color="inherit" fontSize="inherit"/>
        </span>
          <div className={cls.filtered__content}>
            <h4>{item.title === "" ? "Title" : item.title}</h4>
            <span>{item.subtitle === "" ? "Subtitle" : item.subtitle}</span>
          </div>
        </div>
          <span
          style={{background: item.bgColor, color: item.color}}
           className={cls.item__order}>
                {index+1}
          </span>
        </div>
      ))}
      </div>
    </CardContent>
  );
}

export default index;
