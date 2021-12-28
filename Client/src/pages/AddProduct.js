import Navbar from "../components/Navbar";
import styles from "../styles/AddProduct.module.css";
import stylesHome from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

//API config
import { API } from "../config/api";

function AddProduct() {
  let navigate = useNavigate();
  const [mod, setMod] = useState(false);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    stock: "",
    price: "",
    description: "",
    photo: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("photo", form.photo[0], form.photo[0].name);
      formData.set("name", form.name);
      formData.set("price", form.price);
      formData.set("description", form.description);
      formData.set("stock", form.stock);

      await API.post("/product", formData, config);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handModClose = () => {
    setMod(false);
    navigate("/addproduct");
    window.location.reload();
  };
  const handMod = () => setMod(true);

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.AddProduct}>
          <h4>Add Product</h4>
          <form className={styles.editProfilForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              className={styles.inputName}
              onChange={handleChange}
              name="name"
            />
            <input
              type="number"
              placeholder="Stock"
              name="stock"
              className={styles.inputPrice}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Price"
              name="price"
              className={styles.inputPrice}
              onChange={handleChange}
            />
            <textarea
              placeholder="Description Product"
              className={styles.inputDesc}
              onChange={handleChange}
              name="description"
            />

            <label htmlFor="file" className={styles.inputFile}>
              <p>Photo Product</p>
              <img src="./images/attachFile.png" alt="" />
            </label>
            <input
              type="file"
              hidden
              id="file"
              name="photo"
              onChange={handleChange}
              aria-label="File browser example"
            />

            <button className={styles.btnSave} type="submit" onClick={handMod}>
              Add Product
            </button>
          </form>
        </div>
        <div id="preview" className={styles.preview}>
          {preview ? (
            <img src={preview} style={{ objectFit: "content" }} alt=" " />
          ) : (
            <img className={styles.vanish} alt=" " />
          )}
        </div>
      </div>
      <div>
        <hr style={{ marginTop: "80px" }} />
        <h3 style={{ textAlign: "center", fontWeight: "Bold" }}>
          Products List
        </h3>
      </div>
      <div className={stylesHome.products}>
        {products.map((product) => {
          return (
            <div className={stylesHome.product} key={product.id}>
              <img src={product.photo} alt="icon" />
              <p className={stylesHome.productName}>{product.name}</p>
              <p className={stylesHome.productDesc} style={{ marginBottom: 0 }}>
                Rp.{product.price.toLocaleString("id-ID")}
              </p>
              <p
                className={stylesHome.productDesc}
                style={{ marginBottom: "5px" }}
              >
                Stock: {product.stock}
              </p>
            </div>
          );
        })}
        <Modal
          show={mod}
          onHide={handModClose}
          size="lg"
          centered
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Modal.Body className={styles.modalBody}>
            <div className={styles.popup}>
              <p className={styles.popText}>Success Add Product </p>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default AddProduct;
