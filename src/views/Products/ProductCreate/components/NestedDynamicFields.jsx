import styles from "../style.module.scss"
import React from 'react'
import { useFieldArray } from 'react-hook-form';
import FRow from '../../../../components/FormElements/FRow';
import HFTextField from "../../../../components/FormElements/HFTextField";
import HFSwitch from "../../../../components/FormElements/HFSwitch";
import HFImageUpload from "../../../../components/FormElements/HFImageUpload";

//Icons
import { IconButton } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import optionServices from "../../../../services/optionServices";


function NestedDynamicFields({ nestIndex, control}) {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `attribute.${nestIndex}.options`
      });

      
  const handleOption = () => {
    append(
      { price: "", name: "", status: true, photo_url: ""}
    );
  };

  const handleDeleteOption = (optionId) => {
    optionServices.delete(optionId)
    .then((res)=> console.log(res))
    .catch((err) => console.log(err))
  }


  const deleteOption = (optionId,optionIndex) => {
    remove(optionIndex);
    handleDeleteOption(optionId)
  };

// console.log("fields", fields);
  return (
    <div className={styles.dynamic__wrapper}>
    <FRow label="Options">
      <div className={styles.dynamic__field__container}>
        {fields?.map((option, optionIndex) => (
          <div key={option.id} className={styles.dynamic__field__box}>
          <span className={styles.index}>{optionIndex+1})</span>
          <div className={styles.flex}>
            <HFTextField
              name={`attribute.${nestIndex}.options.${optionIndex}.name`}
              fullWidth
              control={control}
              placeholder="Option Title"
              required
              inputStyle={{ padding: "0" }}
            />
            <HFTextField
              type="number"
              name={`attribute.${nestIndex}.options.${optionIndex}.price`}
              fullWidth
              control={control}
              placeholder="Option Value"
              required
              inputStyle={{ padding: "0" }}
            />
          </div>
          <div className={styles.flex}>
              <HFImageUpload
                name={`attribute.${nestIndex}.options.${optionIndex}.photo_url`}
                control={control}
                disabledHelperText
                label="Image Upload"
              />
            <HFSwitch 
              control={control}
              name={`attribute.${nestIndex}.options.${optionIndex}.status`}
            />
          </div>
            <IconButton
              type="button"
              onClick={() => deleteOption(option.optId,optionIndex)}
              className={styles.dynamic__remove__btn}
              aria-label="delete"
            >
              <CancelIcon color="inherit" fontSize="small" />
            </IconButton>
          </div>
        ))}
        <button
          className={styles.dynamic__button}
          type="button"
          onClick={() => handleOption()}
        >
          <AddIcon /> Add options
        </button>
      </div>
    </FRow>
  </div>
  )
}

export default NestedDynamicFields