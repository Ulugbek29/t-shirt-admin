import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import CBreadcrumbs from "../../components/CBreadcrumbs";
import Header from "../../components/Header";
import productsService from "../../services/productsService";
import ProductCreate from "./ProductCreate/ProductCreate";
import categoryService from "../../services/categoryServices";

const PositionsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [categoryList, setCategoryList] = useState([])
  const [imageList, setImageList] = useState([])
  const [tabData, setTabData] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "attribute", // unique name for your Field Array
  });

  const breadCrumbItems = [
    {
      label: "Products",
    },
    {
      label: id ? "Update" : "Create",
    },
  ];


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=> {
    fetchAllCategories()
  },[])

  // Get Single data
  const fetchData = () => {
    if (!id) return setLoader(false);


    productsService
      .getById(id)
      .then((res) => {
        const {name, price, description, category_id, photo_url, attribute ,status} = res
        const optimizedAttributes =  attribute?.map((att) => ({
          options: att.options?.map((option) => ({
              optId: option.id,
              name: option.name, 
              price: +option.price, 
              photo_url: option.photo_url,
              status: option.status === "active" ? true : false
          })),
          sale: att.sale,
          title: att.title, 
          attId: att.id
      }));

       // Setting tab data based on received attributes
       const newTabData = optimizedAttributes.map((att) => ({
        label: att.title ,
        id: att.title, 
      }));

      // Updating the tabData state
      setTabData(newTabData);

        const productObj = {
          attribute:optimizedAttributes,
          name,
          price,
          description,
          category_id,
          photo_url,
          status: status ==="active" ? true : false
        }
        reset(productObj);
        setImageList(photo_url)
      })
      .finally(() => setLoader(false));
  };




  const onSubmit = (values) => {
    
    console.log(values.attribute);
    const attributeArray = values.attribute.map((att) => ({
      options: att.options.map((option) => ({
          id: option.optId || "",
          name: option.name, 
          price: +option.price, 
          photo_url: option.photo_url,  
          status: option.status ? "active" : "inactive",
          status_name: option.optId ? "" : "create"
      })),
      id: att.attId,
      title: att.title, // Provide a valid title here
      status_name: att.attId ? "" : "create",
      sale: att.sale,
  }));

    const data = {
      ...values,
      attribute: attributeArray,
      price: +values.price,
      status: values.status ? "active" : "inactive",
      photo_url: imageList,
      company_id: "c6440797-dc74-4054-a0f0-2a4d3e6d3867",
    };


    //    "category_id": "c8ee405b-f266-4585-b7be-ac10cffef2d6",
    // "company_id": "c6440797-dc74-4054-a0f0-2a4d3e6d3867",
    // "description": "test description 2",
    // "name": "test name 2",
    // "photo_url": "http://api.botm.uz/api/download/91d5d265-b8b9-4d18-a788-413356e6c1bb",
    // "price": 10000,
    // "status": "active"


    if (id) return update(data);
    createProduct(data);
  };

  // Create new Product
  const createProduct = (data) => {
    setBtnLoader(true);
    productsService
      .create(data)
      .then((res) => {
        navigate(`/products`);
        // console.log(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setBtnLoader(false));
  };

  // Update the product
  const update = (data) => {
    setBtnLoader(true);
    productsService
      .update({
        ...data,
        id,
      })
      .then((res) => {
        console.log(res);
        navigate(`/products`);
      })
      .finally(() => setBtnLoader(false));
  };




  // Fetching all categories
  const fetchAllCategories = () => {
    categoryService.getList({
      limit: 100,
    })
    .then((res)=>{
      activeCategories(res.categories)
    })
    .catch((err) => console.log(err))
  }

  // Filtering Active categories 
  const activeCategories = (categoriesList) => {

    const activeCategories = categoriesList
      .filter((category)=> category.status === "active")
      .map((category) => ({
        value: category.id,
        label: category.name
      }))
      
      setCategoryList(activeCategories)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.handleSubmitForm}>
      <Header
        loader={loader}
        backButtonLink={"/products"}
        title="Products"
        // extra={
        //   <>
        //     <CancelButton onClick={() => navigate(-1)} />
        //     <SaveButton type="submit" loading={btnLoader} />
        //   </>
        // }
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
      </Header>
      <div className={styles.CreateUpdateContainer}>
          <ProductCreate
            loader={loader}
            btnLoader={btnLoader}
            control={control}
            categoryList={categoryList}
            fields={fields}
            append={append}
            remove={remove}
            setImageList={setImageList}
            imageList={imageList}
            tabData={tabData}
            setTabData={setTabData}
          />
      </div>
    </form>
  );
};

export default PositionsFormPage;
