import styles from "./style.module.scss";
import React, { useState } from "react";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import HFSwitch from "../../../components/FormElements/HFSwitch";
import HFTextArea from "../../../components/FormElements/HFTextArea";
import HFImageUpload from "../../../components/FormElements/HFImageUpload";
import { useNavigate } from "react-router-dom";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import SelectComponents from "../../../components/common/SelectComponents";
import { IconButton } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import CancelIcon from "@mui/icons-material/Cancel";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import Gallery from "../../../components/Upload/Gallery";
import NestedDynamicFields from "./components/NestedDynamicFields";
import { useEffect } from "react";
import attributeServices from "../../../services/attributeServices";

// const options = [
//   { id: "front", value: "front", label: "Front" },
//   { id: "back", value: "back", label: "Back" },
//   { id: "left-sleeve", value: "left-sleeve", label: "Left Sleeve" },
//   { id: "right-sleeve", value: "right-sleeve", label: "Right Sleeve" },
//   { id: "collar", value: "collar", label: "Collar" },
//   { id: "pocket", value: "pocket", label: "Pocket" },
//   // Add more options as needed
// ];

export default function ProductCreate({
  loader,
  btnLoader,
  control,
  categoryList,
  fields,
  append,
  remove,
  setImageList,
  imageList,
  tabData,
  setTabData
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  // const [tabData, setTabData] = useState([]);

  useEffect(() => {
    setTabData((prevTabData) => {
      // Create a copy of the previous tab data
      const newTabData = [...prevTabData];

      // Check if there are new fields added
      const newFields = fields.slice(newTabData.length);

      // Add new tabs for each new field
      newFields.forEach((field) => {
        newTabData.push({
          label: field.mainTitle || "New Attribute",
          id: field.id,
        });
      });

      return newTabData;
    });
  }, [fields]);

// console.log("fields",fields );
  // SetValue of tab
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  // Responsible appending new fields 
  const handleAppend = () => {
    append({ title: "", options: [{ price: "", name: "", status: true, photo_url: ""}] });
    setValue(tabData.length)
  };


  const handleDeleteAttribute = (attributeId) => {
    attributeServices.delete(attributeId)
    .then((res)=> console.log(res))
    .catch((err) => console.log(err))
  }


  // Responsible removing fields 
  const handleRemove = (attributeId,index) => {
    // Remove the field at the specified index
    remove(index);

    // Calculate the new value for the selected tab index
    let newValue =  value;

    // If the removed tab was the last tab and there are more than one tab
    if (index === tabData.length - 1 && tabData.length > 1) {
      newValue = index - 1; // Switch to the previous tab
    }



    // Remove the corresponding tab data
    setTabData((prevTabData) => {
      const newTabData = [...prevTabData];
      newTabData.splice(index, 1); // Remove the tab data at the specified index
      return newTabData;
    });
    // Update the selected tab index
    setValue(newValue);
    //deleting by api
    handleDeleteAttribute(attributeId)
  };


// Responsible for Updating the tabs value based on the mainTitle value
  const handleTextFieldChange = (event, index) => {
    const updatedTabData = [...tabData];
    updatedTabData[index].label = event.target.value;
    setTabData(updatedTabData);
  };


  return (
    <div className={styles.flex}>
      <FormCard visible={!loader} title="Main info">
        <div className={styles.flex}>
          <FRow required label="Product Name">
            <HFTextField
              fullWidth
              control={control}
              name="name"
              required
              rules={{}}
            />
          </FRow>
          <FRow required label="Price">
            <HFTextField
              type="number"
              fullWidth
              control={control}
              name="price"
              required
              rules={{}}
            />
          </FRow>
        </div>
        <div className={styles.flex}>
          <FRow required label="Select Category">
            <HFSelect
              fullWidth
              control={control}
              name="category_id"
              // label="Select Category"
              options={categoryList}
              required
              rules={{}}
            />
          </FRow>
        </div>

        <FRow label="Description">
          <HFTextArea
            control={control}
            className={styles.description}
            label="Message"
            name="description"
          />
        </FRow>

        <div className={styles.flex}>
          <FRow required label="Upload Images">
            {/* <HFImageUpload
                fullWidth
                control={control}
                required
                label="Image Upload"
                name="photo_url"
              /> */}
            <Gallery setGallery={setImageList} gallery={imageList} />
          </FRow>

          <FRow label="Status Available">
            <HFSwitch
              name="status"
              control={control}
              label="Switch Status"
              defaultValue={false}
              color="primary"
            />
          </FRow>
        </div>
        <div className={styles.buttons}>
          <CancelButton onClick={() => navigate(-1)} />
          <SaveButton type="submit" loading={btnLoader} />
        </div>
      </FormCard>

      <FormCard
        title="Dynamic Field"
        visible={!loader}
        extra={
          <button
            className={styles.add__dynamic__field__btn}
            type="button"
            onClick={() => handleAppend()}
          >
            Add New Attribute
          </button>
        }
      >
        <TabContext value={value}>
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            aria-label="scrollable auto tabs example"
            onChange={handleChange}
          >
            {tabData.map((tab, index) => (
              <Tab sx={{fontWeight: "600"}} key={tab.id} label={tab.label} value={index} />
            ))}
          </TabList>

          <div className={styles.dynamic__field__wrapper}>
            {fields.map((field, index) => {
              return (
                <TabPanel value={index} sx={{ padding: "10px 0" }}>
                  <div key={field.id} className={styles.dynamic__field}>
                    <div className={styles.dynamic__title}>
                      <FRow required label="Title">
                        <HFTextField
                          fullWidth
                          control={control}
                          name={`attribute.${index}.title`}
                          onBlur={(event) =>
                            handleTextFieldChange(event, index)
                          }
                          inputStyle={{ padding: "0" }}
                        />
                      </FRow>
                      <FRow required label="Sale">
                      <HFSwitch 
                          control={control}
                          name={`attribute.${index}.sale`}
                          defaultValue={true}
                        />
                      </FRow>
                    </div>

                    <NestedDynamicFields control={control} nestIndex={index} />

                    <IconButton
                      type="button"
                      onClick={() => handleRemove(field.attId,index)}
                      className={styles.dynamic__parent__remove__button}
                      aria-label="delete"
                    >
                      <DisabledByDefaultIcon color="inherit" />
                    </IconButton>
                  </div>
                </TabPanel>
              );
            })}
          </div>
        </TabContext>

        {/* <FRow label="Status Available">
              <SelectComponents 
                control={control}
                name="selectedComponent"
                options={options}
                columns="col-3"
              />
            </FRow>  */}
      </FormCard>
    </div>
  );
}
