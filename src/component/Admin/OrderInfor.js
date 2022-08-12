import React, { useEffect } from "react";
import config from "../../config";
import axios from "axios";
import uuid from "react-uuid";

function OrderInfor(props) {
  const [orders, setOrders] = React.useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${config.APP_API_URL}/books/order`,
    })
      .then((res) => {
        setOrders(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleDeleteOrder = async (index, e) => {
    e.preventDefault();
    if (!orders[index].receiptHandle) {
    }
    try {
      const response = await axios({
        method: "delete",
        url: `${config.APP_API_URL}/books/order`,
        data: {
          receiptHandle: orders[index].receiptHandle,
        },
        headers: { "Content-Type": "application/json" },
      });

      const status = response.status;
      if (status === 200) {
        alert("Delete successfully!");

        let order_delete = orders[index];
        if (orders[index].receiptHandle) {
          setOrders(
            orders.filter(
              (order) => order.receiptHandle !== order_delete.receiptHandle
            )
          );
        } else {
          setOrders(
            orders.filter(
              (order) => order.books[0].id !== order_delete.books[0].id
            )
          );
        }
      } else {
        alert("Error Occured while handle the order");
      }
    } catch (error) {
      console.log(error);
      alert("Error Occured while handle the order");
    }
  };

  const handleOrder = async (index, e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        url: `${config.APP_API_URL}/books/order/handle`,
        data: {
          id: uuid(),
          receiptHandle: orders[index].receiptHandle,
          books: orders[index].books,
          price: orders[index].price,
        },
        headers: { "Content-Type": "application/json" },
      });

      const status = response.status;
      if (status === 200) {
        alert("Handle successfully!");

        let new_orders = [...orders];
        new_orders[index].status = "Processed";
        setOrders(new_orders);
      } else {
        alert("Error Occured while handle the order");
      }
    } catch (error) {
      alert("Error Occured while handle the order");
    }
  };

  var elements = orders.map((order, index) => {
    //console.log(order)
    return (
      <tr key = {order.id}>
        <td>{index + 1}</td>
        <td>
          {order.books.map((book) => (
            <li className="list-group list-group-flush">{book.name}</li>
          ))}
        </td>
        <td>
          {order.books.map((book) => (
            <li className="list-group list-group-flush">{book.qty}</li>
          ))}
        </td>
        <td>${order.price}</td>
        <td>{order.status}</td>
        {order.status !== "Processed" ? (
          <td>
            <button
              type="button"
              className="btn btn-danger mr-3"
              onClick={(e) => handleDeleteOrder(index, e)}
            >
              Delete
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              type="button"
              className="btn btn-primary"
              disabled={order.status === "Processed" ? true : false}
              onClick={(e) => handleOrder(index, e)}
            >
              Handle
            </button>
          </td>
        ) : (<td> </td>)}
      </tr>
    );
  });

  return (
    <div className="container pt-5">
      <h2>List of Orders</h2>
      <table className="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Other</th>
          </tr>
        </thead>
        <tbody>{elements}</tbody>
      </table>
    </div>
  );
}

export default OrderInfor;
