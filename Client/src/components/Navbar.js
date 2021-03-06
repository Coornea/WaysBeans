//import "./Header.css";
import styles from "../styles/Navbar.module.css";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Dropdown, NavDropdown, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

//context
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";

//API config
import { API, setAuthToken } from "../config/api";

function Navbar() {
  let navigate = useNavigate();
  //state
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [orderedMenus, setOrderedMenus] = useContext(CartContext);
  //const [counterCart, setCounterCart] = useState(0);
  const [message, setMessage] = useState(null);

  //Register modal toggle
  const handRegClose = () => setRegister(false);
  const handReg = () => setRegister(true);

  //login modal toggle
  const handLogClose = () => setLogin(false);
  const handLog = () => setLogin(true);

  //register form (state)
  const [regForm, setRegForm] = useState({
    email: "",
    password: "",
    fullname: "",
  });
  const { email, password, fullname } = regForm;

  //login form (state)
  const [logForm, setLogForm] = useState({
    email: "",
    password: "",
  });
  const { logEmail, logPassword } = logForm;

  const handleRegChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleLogChange = (e) => {
    setLogForm({
      ...logForm,
      [e.target.name]: e.target.value,
    });
  };

  //register handle
  const handleRegister = async (e) => {
    try {
      e.preventDefault();

      // Create Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Convert form data to string
      const body = JSON.stringify(regForm);

      // Insert data user to database
      const response = await API.post("/register", body, config);

      //close & empty modal
      setRegister(false);
      setRegForm({
        email: "",
        password: "",
        fullName: "",
      });

      //notification
      if (response.data.status === "success") {
        const alert = (
          <Alert
            variant="success"
            onClose={() => setMessage(null)}
            className="py-2 mb-0"
            dismissible
          >
            Registration Success
          </Alert>
        );
        setMessage(alert);
      } else {
        const alert = (
          <Alert
            variant="danger"
            onClose={() => setMessage(null)}
            className="py-1"
            dismissible
          >
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert
          variant="danger"
          onClose={() => setMessage(null)}
          className="py-1"
          dismissible
        >
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  //login handle
  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      // Create Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // Convert form data to string
      const body = JSON.stringify(logForm);

      // Insert data user to database
      const response = await API.post("/login", body, config);

      //close & empty modal
      setLogin(false);
      setLogForm({ email: "", password: "" });

      //notification & change state
      if (response.data.status === "success") {
        await dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data.user,
        });
        if (localStorage.token) {
          setAuthToken(localStorage.token);
        }

        const alert = (
          <Alert
            variant="success"
            // onClose={() => setMessage(null)}
            className="py-2 mb-0"
            style={{ textAlign: "center" }}
            dismissible
            onWaiting={() => setMessage(null)}
          >
            Login Success
          </Alert>
        );
        setMessage(alert);
      } else {
        const alert = (
          <Alert
            variant="danger"
            onClose={() => setMessage(null)}
            className="py-1 mb-0"
            dismissible
          >
            Login Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert
          variant="danger"
          onClose={() => setMessage(null)}
          className="py-1 mb-0"
          dismissible
        >
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  const logout = () => {
    dispatch({
      type: "LOGOUT",
      payload: "",
    });
    navigate("/");
  };

  return (
    <nav>
      <Link to="/">
        <img src="./images/Icon.png" className={styles.icon} alt="icon" />
      </Link>
      {!state.isLogin ? (
        <span className={styles.buttons}>
          <button onClick={handReg} className={styles.Headerbtn}>
            Register
          </button>
          <button onClick={handLog} className={styles.Headerbtn}>
            Login
          </button>
        </span>
      ) : state.user.role === "admin" ? (
        <span className={styles.buttons}>
          <NavDropdown
            id="dropdown-basic"
            title={
              <img
                className={styles.avatar}
                src={state.user.photo}
                alt="avatar"
              />
            }
          >
            <Link
              className={styles.dropdownItem}
              to="/addproduct"
              style={{ textDecoration: "none" }}
            >
              <img
                src="./images/add product.png"
                className={styles.dropdownPict}
                alt="add product"
              />
              <span className={styles.dropdownText}>Add Product</span>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item
              className={styles.dropdownItem}
              href="#"
              onClick={logout}
              style={{ padding: 0 }}
            >
              <img
                src="./images/logout.png"
                className={styles.dropdownPict}
                alt="logout"
              />
              <span className={styles.dropdownText}>Logout</span>
            </Dropdown.Item>
          </NavDropdown>
        </span>
      ) : (
        <span className={styles.buttons}>
          <Link to="/cart">
            <img src="./images/Cart.png" alt="cart" />
            {orderedMenus.subtotal === 0 ? (
              <span />
            ) : (
              <span className="position-absolute translate-middle badge rounded-circle bg-danger">
                {orderedMenus.subtotal}
              </span>
            )}
          </Link>
          <NavDropdown
            id="dropdown-basic"
            title={
              <img
                className={styles.avatar}
                src={state.user.photo}
                alt="avatar"
              />
            }
          >
            <Link
              className={styles.dropdownItem}
              to="/profile"
              style={{ textDecoration: "none" }}
            >
              <img
                src="./images/user.png"
                className={styles.dropdownPict}
                alt="profile"
              />
              <span className={styles.dropdownText}>Profile</span>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item
              className={styles.dropdownItem}
              href="#"
              onClick={logout}
              style={{ padding: 0 }}
            >
              <img
                src="./images/logout.png"
                className={styles.dropdownPict}
                alt="logout"
              />
              <span className={styles.dropdownText}>Logout</span>
            </Dropdown.Item>
          </NavDropdown>
        </span>
      )}

      <Modal show={register} onHide={handRegClose}>
        <Modal.Header>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.loginform} onSubmit={handleRegister}>
            <input
              type="email"
              placeholder="Email"
              onChange={handleRegChange}
              value={email}
              name="email"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handleRegChange}
              value={password}
              name="password"
            />
            <input
              type="text"
              placeholder="Full Name"
              onChange={handleRegChange}
              value={fullname}
              name="fullname"
            />
            <button type="submit">Register</button>
          </form>
        </Modal.Body>
        <Modal.Footer>Already have an account ? Klik Here</Modal.Footer>
      </Modal>
      <Modal show={login} onHide={handLogClose}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className={styles.loginform} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              id="email"
              onChange={handleLogChange}
              required
              value={logEmail}
              name="email"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handleLogChange}
              value={logPassword}
              name="password"
            />
            <button type="submit">Login</button>
          </form>
        </Modal.Body>
        <Modal.Footer>Don't have an account ? Klik Here</Modal.Footer>
      </Modal>
    </nav>
  );
}

export default Navbar;
