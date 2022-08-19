import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainpage from "./component/Mainpage/Mainpage";
import Navigation from "./component/Header/Navigation";
import UploadBook from "./component/Upload/UploadBook";
import UpdateBook from "./component/Update/UpdateBook";
import Basket from "./component/Basket/Basket";
import Admin from "./component/Admin/Admin";
import BookDetail from "./component/Mainpage/BookDetail";
import Login from "./component/Authen/Login";
import Register from "./component/Authen/Register";
import OrderInfor from "./component/Admin/OrderInfor";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateBook: {
        id: "",
        name: "",
        author: "",
        description: "",
      },
      countItems: 0,
      itemInCard: [],
      isNavbarHidden: false,
      isAdmin: true,
    };
  }

  onAdd = (book) => {
    const exist = this.state.itemInCard.find((x) => x.id === book.id);
    if (exist) {
      let itemInCard = this.state.itemInCard.map((x) =>
        x.id === book.id ? { ...exist, qty: exist.qty + 1 } : x
      );
      this.setState({
        itemInCard: itemInCard,
      });
    } else {
      this.setState((prevState) => ({
        itemInCard: [...prevState.itemInCard, { ...book, qty: 1 }],
      }));
    }
  };

  onRemove = (book) => {
    const exist = this.state.itemInCard.find((x) => x.id === book.id);
    if (exist.qty === 1) {
      this.setState((prevState) => ({
        itemInCard: prevState.itemInCard.filter((x) => x.id !== book.id),
      }));
    } else {
      this.setState((prevState) => ({
        itemInCard: prevState.itemInCard.map((x) =>
          x.id === book.id ? { ...exist, qty: exist.qty - 1 } : x
        ),
      }));
    }
  };

  clearCart = () => {
    this.setState({itemInCard: []})
  }

  getUpdateBook = (updateBook) => {
    this.setState({ updateBook: updateBook });
  };

  hiddenNavbar = (isNavbarHidden) => {
    this.setState({ isNavbarHidden: isNavbarHidden });
  };

  setAdmin = (isAdmin) => {
    this.setState({ isAdmin: isAdmin });
  };

  render() {
    return (
      <div>
        <Router>
          {this.state.isNavbarHidden ? null : (
            <Navigation
              itemCount={this.state.itemInCard.length}
              itemAdminLogin={this.state.isAdmin}
            ></Navigation>
          )}
          <Routes>
            <Route
              exact
              path="/"
              element={<Mainpage onAdd={this.onAdd} />}
            ></Route>
            <Route path="/upload" element={<UploadBook />}></Route>
            <Route path="/update" element={this.state.isAdmin ? <UpdateBook /> : null }></Route>
            <Route path="/admin" element={this.state.isAdmin ? <Admin /> : null}></Route>
            <Route path="/detail/:name" element={<BookDetail onAdd={this.onAdd}/>}></Route>
            <Route
              path="/cart"
              element={
                <Basket
                  currentItemInCart={this.state.itemInCard}
                  onAdd={this.onAdd}
                  onRemove={this.onRemove}
                  checkOut={this.clearCart}
                />
              }
            ></Route>
            <Route
              path="/login"
              element={
                <Login
                  setNavbar={this.hiddenNavbar}
                  setAdmin={this.setAdmin}
                />
              }
            ></Route>
            <Route
              path="/register"
              element={
                <Register
                  setNavbar={this.hiddenNavbar}
                />
              }
            ></Route>
            <Route path="/order" element={this.state.isAdmin ? <OrderInfor /> : null}></Route>
          </Routes>
        </Router>
      </div>
    );
  }
}
export default App;
