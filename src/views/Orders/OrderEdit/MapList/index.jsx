import React from 'react'
import cls from "./style.module.scss"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useRef } from 'react';
import useOutsideClick from "../../../../hooks/useOutsideClick"


export default function index({locations,pickAddress=()=>{}, setAddressList}) {
    const ref = useRef()
    useOutsideClick(ref, () => setAddressList([]));
  return (
    <div ref={ref} className={cls.map__list}>
    {locations?.map((location,index)=> {
        return <div key={index} onClick={()=>pickAddress(location.coordinates, location.name)} className={cls.address}>
            <span><LocationOnIcon fontSize='inherit' color='primary'/></span>
            <div>
            <h2>{location.name}</h2>
            <p>{location.description}</p>
            </div>
        </div>
    })}
    </div>
  )
}
