import styles from "../styles/TransactionTable.module.css";
import React, { useState, useContext, useEffect } from "react";
import Navbar from "./Navbar";

//context
import { UserContext } from "../context/userContext";

//API config
import { API } from "../config/api";

export default function Transactions() {
  const [state, dispatch] = useContext(UserContext);
  const [datas, setDatas] = useState([]);

  const getTransactions = async () => {
    try {
      await API.get("/transactions").then((response) => {
        const temp = response.data.data.transactions.map((elem) => {
          return {
            id: elem.id,
            name: elem.name,
            address: elem.address,
            order: elem.products[0].name,
            status: elem.status,
          };
        });
        console.log(temp);
        setDatas(temp);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //did mount -> get transactions
  useEffect(() => {
    getTransactions();
  }, []);
  useEffect(() => {
    getTransactions();
  }, [state]);

  //logout
  const logout = () =>
    dispatch({
      type: "LOGOUT",
      payload: "",
    });

  //approve & Cancel transactions
  const approveTransaction = async (dataID) => {
    try {
      //Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      //prepare body req
      const status = {
        status: "on the way",
      };
      const body = JSON.stringify(status);

      //update transaction
      await API.patch(`/transaction/${dataID}`, body, config);

      //change datas state
      const currentDatas = datas.map((elem) => {
        if (elem.id === dataID) {
          elem.status = "on the way";
        }
        return elem;
      });
      setDatas(currentDatas);
    } catch (error) {
      console.log(error);
    }
  };
  const cancelTransaction = async (dataID) => {
    try {
      //Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      //prepare body req
      const status = {
        status: "cancel",
      };
      const body = JSON.stringify(status);

      await API.patch(`/transaction/${dataID}`, body, config);

      //change datas state
      const currentDatas = datas.map((elem) => {
        if (elem.id === dataID) {
          elem.status = "cancel";
        }
        return elem;
      });
      setDatas(currentDatas);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className={styles.Transaction}>
          <h4>Income Transaction</h4>
          <table>
            <tr className={styles.th}>
              <td className={styles.no}>No</td>
              <td className={styles.name}>Name</td>
              <td className={styles.address}>Address</td>
              <td className={styles.order}>Products Order</td>
              <td className={styles.status}>Status</td>
              <td className={styles.action}>Action</td>
            </tr>
            {datas.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.address}</td>
                  <td>{data.order}</td>
                  {data.status === "waiting approve" ? (
                    <>
                      <td style={{ color: "#FF9900" }}>Waiting Approve</td>
                      <td className={styles.actionTd}>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => cancelTransaction(data.id)}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.ApproveBtn}
                          onClick={() => approveTransaction(data.id)}
                        >
                          Approve
                        </button>
                      </td>
                    </>
                  ) : data.status === "on the way" ? (
                    <>
                      <td style={{ color: "#00D1FF" }}>On The Way</td>
                      <td className={styles.actionTd}>
                        <img src="./images/done.png" alt="status pict" />
                      </td>
                    </>
                  ) : data.status === "success" ? (
                    <>
                      <td style={{ color: "#78A85A" }}>Success</td>
                      <td className={styles.actionTd}>
                        <img src="./images/done.png" alt="status pict" />
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ color: "#E83939" }}>Cancel</td>
                      <td className={styles.actionTd}>
                        <img src="./images/cancel.png" alt="status pict" />
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
