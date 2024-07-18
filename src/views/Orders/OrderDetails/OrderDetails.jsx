import cls from "./style.module.scss";
import React, { useRef } from "react";
import Modal from "@mui/material/Modal";
import CardContent from "../../../components/common/CardContent";
import { Button, IconButton } from "@mui/material";
import Stepper from "../../../components/common/Stepper";
// import { apikey,mapDefaults } from "../../../constants/mapDefaults";
import { YMaps, Map, Placemark, ZoomControl } from "react-yandex-maps";
import { useNavigate } from "react-router-dom";
import orderServices from "../../../services/orderServices";
import { useEffect } from "react";
import { useState } from "react";
import { addSpaceForNumbers } from "../../../utils/addSpaceForNumbers";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ImageViewer from "react-simple-image-viewer";

export default function OrderDetails({ modal, handleClose = () => {} }) {
  const [userOrderData, setUserOrderData] = useState({});
  const [showMainImage, setShowMainImage] = useState({ images: [], status: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (modal.id) {
      fetchUserOrder();
    }
  }, [modal.id]);

  const imageClickHandler = (images) => {
    setShowMainImage({ images, status: true });
  };

  const fetchUserOrder = () => {
    orderServices
      .getById(modal.id)
      .then((res) => setUserOrderData(res))
      .catch((err) => console.log(err));
  };

  const orderStatus = () => {
    const status = userOrderData.order_status;
    let statusNumber = 0;
    switch (status) {
      case "preparing":
        statusNumber = 1;
        break;
      case "ready_for_delivering":
        statusNumber = 2;
        break;
      case "on_the_way":
        statusNumber = 3;
        break;
      case "delivered":
        statusNumber = 4;
        break;
      default:
        break;
    }
    return statusNumber;
  };

  const handleImageDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.substring(url.lastIndexOf("/") + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = userOrderData.order_products?.products.reduce((acc, product) => {
    const existingProduct = acc.find((p) => p.product__id === product.product__id);
    if (!existingProduct) {
      acc.push({ ...product });
    }
    return acc;
  }, []);

  return (
    <>
      {showMainImage.status && (
        <div className={cls.imageViewerWrapper}>
          <ImageViewer
            src={showMainImage.images}
            currentIndex={0}
            disableScroll={true}
            closeOnClickOutside={true}
            onClose={() => setShowMainImage({ images: [], status: false })}
          />
        </div>
      )}
      <div>
        <Modal
          open={modal.status}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {modal.id && (
            <div className={cls.modal__container}>
              <CardContent
                title="Information"
                extra={
                  <>
                    <Button onClick={() => navigate(`/orders/${modal.id}`)} variant="contained">
                      Редактировать
                    </Button>
                  </>
                }
              >
                <div className={cls.content}>
                  <div className={cls.content__wrapper}>
                    <div className={cls.img__wrapper}>
                      {filteredProducts?.map((order, index) => (
                        <div key={index} className={cls.product__img__wrapper}>
                          <div
                            onClick={() => imageClickHandler([order.product_image, ...(order.upload_images || [])])}
                            className={cls.product__img}
                          >
                            <img src={order.product_image} />
                            <IconButton
                              className={cls.upload__img__btn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageDownload(order.product_image);
                              }}
                            >
                              <CloudDownloadIcon />
                            </IconButton>
                            <div className={cls.product__uploaded__img}>
                              {order.upload_images?.length > 0 &&
                                order.upload_images.map((uplImg, i) => (
                                  <div key={i} className={cls.uploaded__img}>
                                    <img src={uplImg} />
                                    <IconButton
                                      className={cls.uploaded__upload__img__btn}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageDownload(uplImg);
                                      }}
                                    >
                                      <CloudDownloadIcon fontSize="small" />
                                    </IconButton>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={cls.table__details}>
                      <div className={cls.stepper}>
                        <Stepper orderStatus={orderStatus} />
                      </div>
                      <div className={cls.client__info}>
                        <p>Информация о клиенте</p>
                        <table>
                          <thead>
                            <tr>
                              <th>Имя клиента</th>
                              <th>{userOrderData.customer_details?.name}</th>
                              <th>Телефон клиента</th>
                              <th>{userOrderData.customer_details?.phone}</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className={cls.client__info}>
                        <p>Адрес</p>
                        <table>
                          <thead>
                            <tr>
                              <th>Адрес</th>
                              <th>{userOrderData.customer_details?.address.name}</th>
                              <th>Квартира</th>
                              <th>none</th>
                            </tr>
                            <tr>
                              <th>Этаж</th>
                              <th>none</th>
                              <th>Подъезд</th>
                              <th>none</th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                      <div className={cls.client__info}>
                        <p>Информация о продуктe и Цена</p>
                        <table className={cls.order__table}>
                          <thead>
                            <tr>
                              <th>Название</th>
                              <th>Цена</th>
                              <th>Количество</th>
                              <th>Атрибуты</th>
                              <th>Всего</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userOrderData.order_products?.products &&
                              userOrderData.order_products?.products.map((order, i) => (
                                <tr key={order.id}>
                                  <td>{order.product_name}</td>
                                  <td>{addSpaceForNumbers(order.product_price)} сум</td>
                                  <td>{order.count}</td>
                                  <td>
                                    <ul>
                                      {order.attributes ? (
                                        order.attributes.map((att, j) => (
                                          <li key={j}>
                                            {att.title} - {att.options[0].name}
                                          </li>
                                        ))
                                      ) : (
                                        <li>No Attributes</li>
                                      )}
                                    </ul>
                                  </td>
                                  <td>{addSpaceForNumbers(order.total_price)} сум</td>
                                </tr>
                              ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td>Итого</td>
                              <td colSpan={4}>
                                {addSpaceForNumbers(userOrderData.total_price ? userOrderData?.total_price : "")} сум
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* yandexMap */}
                  <div className={cls.yandex__map}>
                    <YMaps>
                      <Map
                        width="100%"
                        height="100%"
                        state={{
                          center: [
                            +userOrderData.customer_details?.address.long,
                            +userOrderData.customer_details?.address.lat,
                          ],
                          zoom: 16,
                        }}
                      >
                        <Placemark
                          geometry={[
                            +userOrderData.customer_details?.address.long,
                            +userOrderData.customer_details?.address.lat,
                          ]}
                          onClick={(e) => {
                            const map = e.get("map");
                            map.setZoom(18);
                            map.setCenter([
                              +userOrderData.customer_details?.address.long,
                              +userOrderData.customer_details?.address.lat,
                            ]);
                          }}
                        />
                        <ZoomControl
                          options={{
                            float: "none",
                            position: { top: 100, right: 10 },
                          }}
                        />
                      </Map>
                    </YMaps>
                  </div>
                </div>
              </CardContent>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
