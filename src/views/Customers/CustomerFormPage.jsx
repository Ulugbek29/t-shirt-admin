import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CBreadcrumbs from "../../components/CBreadcrumbs";
import Header from "../../components/Header";
import customerService from "../../services/customerServices";
import CreateCustomer from "./CreateCustomer";

export default function UsersFormPage() {
  const { id } = useParams()
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm();
  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);

  const breadCrumbItems = [
    {
      label: "Customers",
    },
    {
      label: id ? "Update" : "Create",
    },
  ];


  useEffect(()=> {
    fetchSingleUserData();
  }, [id])


  

//  Get Single user for update
 const fetchSingleUserData = () => {
  if (!id) return setLoader(false);

  customerService.getById(id)
    .then((res) => {
      const {name,phone} = res
      const userObj = {
        name,
        phone,
      }
      reset(userObj);
    })
    .finally(() => setLoader(false));
};


  const onSubmit = (value) => {

    const data = {
      ...value,
      company_id: "c6440797-dc74-4054-a0f0-2a4d3e6d3867",
    }

    if(id) return updateCustomer(data)
    createCustomer(data)
  };



  // Create new user
  const createCustomer = (data) => {
    setBtnLoader(true)
    customerService.create(data)
    .then(res => {
      navigate(`/customer`)
      })
    .catch(err => console.log(err))
    .finally(()=> setBtnLoader(false))
  }


  //Update user 
  const updateCustomer = (data) => {
    setBtnLoader(true)
    customerService.update({
      ...data,
      id,
    })
    .then(res => {
      navigate(`/customer`)
    })
    .catch((err)=> console.log(err))
    .finally(()=> setBtnLoader(false))
  }



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Header
        loader={loader}
        backButtonLink={"/customer"}
        title="Customer"
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
      </Header>

        <CreateCustomer control={control} id={id} loader={loader} btnLoader={btnLoader}/>
    </form>
  );
}
