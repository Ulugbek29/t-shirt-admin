// ReactAsyncSelectPagination.js

import React from "react";
import { Controller } from "react-hook-form";
import Creatable from "react-select/creatable";
import { withAsyncPaginate } from "react-select-async-paginate";

const CreatableAsyncPaginate = withAsyncPaginate(Creatable);

const ReactAsyncSelectPagination = ({
  control,
  name,
  defaultValue,
  loadOptions,
  onCreateOption,
  options, // Receive options state as a prop
  setNewCustomer,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <CreatableAsyncPaginate
          loadOptions={loadOptions}
          onCreateOption={onCreateOption}
          options={options} // Pass options state
          value={value}
          onChange={(selectedOption) => {
            onChange(selectedOption);
            if (
              selectedOption &&
              selectedOption.label.includes("Create new customer")
            ) {
              setNewCustomer(true);
            } else {
              setNewCustomer(false);
            }
          }}
          {...rest}
        />
      )}
    />
  );
};

export default ReactAsyncSelectPagination;
