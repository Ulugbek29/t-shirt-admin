import AddCircleOutlineIcon from "@mui/icons-material/Upload";
import { useState } from "react";
import { useRef } from "react";
import ImageViewer from "react-simple-image-viewer";
import { CircularProgress } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import "./style.scss"
import "./Gallery/style.scss";
import fileService from "../../services/fileService";

const ImageUpload = ({ value, onChange, className, error }) => {
  const inputRef = useRef(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const imageClickHandler = (index) => {
    setPreviewVisible(true);
  };

  const inputChangeHandler = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService
      .uploadImage(data)
      .then((res) => {
        // console.log(res)
        onChange("https://api.zbek.botm.uz/api/download/" + res.id);
      })
      .finally(() => setLoading(false));
  };

  const deleteImage = (id) => {
    onChange(null);
  };

  const closeButtonHandler = (e) => {
    e.stopPropagation();
    deleteImage();
  };

  return (
    <div className={`single__image ${className}`} >
      {value && (
        <div className="block" onClick={() => imageClickHandler()}>
          <button
            className="close-btn"
            type="button"
            onClick={(e) => closeButtonHandler(e)}
          >
            <CancelIcon />
          </button>
          <img src={value} alt="" />
        </div>
      )}

      {!value && (
        <div
          className={`add-block block ${error ? "error" : ""}`}
          onClick={() => inputRef.current.click()}
        >
          <div className="add-icon">
            {!loading ? (
              <>
                <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                {/* <p>Max size: 4 MB</p> */}
              </>
            ) : (
              <CircularProgress />
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={inputChangeHandler}
          />
        </div>
      )}

      {previewVisible && (
        <ImageViewer
          src={[value]}
          currentIndex={0}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={() => setPreviewVisible(false)}
        />
      )}
    </div>
  );
};

export default ImageUpload;
