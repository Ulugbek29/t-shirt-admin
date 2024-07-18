import classes from "./style.module.scss";
import React from "react";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFTextField from "../../../components/FormElements/HFTextField";
import HFTextArea from "../../../components/FormElements/HFTextArea";
import HFSwitch from "../../../components/FormElements/HFSwitch";
import HFImageUpload from "../../../components/FormElements/HFImageUpload";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { useNavigate } from "react-router-dom";

export default function CategoryCreate({ control, loader, btnLoader }) {
  const navigate = useNavigate()

  return (
    <div className={classes.create__container}>
      <FormCard maxWidth="800px" visible={!loader} title="Category create">
        <FRow required label="Category Name">
          <HFTextField
            fullWidth
            control={control}
            name="name"
            required
            rules={{}}
          />
        </FRow>
        <FRow label="Description">
          <HFTextArea
            control={control}
            className={classes.description}
            label="Description"
            name="description"
          />
        </FRow>

        <div className={classes.flex}>
        <FRow required label="Upload category image">
          <HFImageUpload
            control={control}
            name="photo_url"
            required
            rules={{}}
          />
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

        <div className={classes.buttons}>
        <CancelButton onClick={() => navigate(-1)} />
            <SaveButton type="submit" loading={btnLoader}/>
        </div>
      </FormCard>

    </div>
  );
}
