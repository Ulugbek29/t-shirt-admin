import React, { useEffect, useRef, useState } from 'react'
import  "./style.scss"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-date-range';
import useOutsideClick from "../../../hooks/useOutsideClick"


export default function index({state, setState}) {
  const [open, setOpen] = useState(false)
  const calRef = useRef()
  // const [state, setState] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: 'selection'
  //   }
  // ]);

  useOutsideClick(calRef, () => setOpen(false))


  const handleSelect = (range) => {
    setState(range)
  }

  return (
    <div className="calendar__box">
        <input 
        className="range__date__input"
        value={format(state[0].startDate, 'dd/MM/yyyy') + `~` + format(state[0].endDate, 'dd/MM/yyyy')}
        readOnly
        onClick={() => setOpen(open => !open)}
         />



{open && (
    <div
    ref={calRef}
    >
        <DateRange
          className="calendar"
          onChange={item => handleSelect([item.selection])}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
          />
    </div>
)}
      </div>
  )
}
