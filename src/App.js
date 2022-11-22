import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloLink } from "apollo-link";
import aws_config from "./aws-exports";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

import Mainpage from "./component/Mainpage/Mainpage";
import Navigation from "./component/Header/Navigation";
import UploadBook from "./component/Upload/UploadBook";
import UpdateBook from "./component/Update/UpdateBook";
import Basket from "./component/Basket/Basket";
import Admin from "./component/Admin/Admin";
import BookDetail from "./component/Mainpage/BookDetail";
import Login from "./component/Authen/Login";
import Logout from "./component/Authen/Logout"
import Chat from "./component/Chat/Chat";
import Register from "./component/Authen/Register";
import OrderInfor from "./component/Admin/OrderInfor";
import Amplify from "@aws-amplify/core";

Amplify.configure(aws_config);

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
      isAdmin: false,
      isLogin: false,
      currentUser: {},
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
    this.setState({ itemInCard: [] });
  };

  getUpdateBook = (updateBook) => {
    this.setState({ updateBook: updateBook });
  };

  hiddenNavbar = (isNavbarHidden) => {
    this.setState({ isNavbarHidden: isNavbarHidden });
  };

  setAdmin = (isAdmin) => {
    this.setState({ isAdmin: isAdmin });
  };

  setLogin = (isLogin) => {
    this.setState({ isLogin: isLogin });
  };

  setCurrentUser = (currentUser) => {
    this.setState({ currentUser: currentUser });
  };


  render() {
    return (
      <div>
        <Router>
          {this.state.isNavbarHidden ? null : (
            <Navigation
              itemCount={this.state.itemInCard.length}
              itemAdminLogin={this.state.isAdmin}
              itemUserLogin={this.state.isLogin}
            ></Navigation>
          )}
          <Routes>
            <Route
              exact
              path="/"
              element={<Mainpage onAdd={this.onAdd} />}
            ></Route>
            <Route path="/upload" element={<UploadBook />}></Route>
            <Route
              path="/update"
              element={this.state.isAdmin ? <UpdateBook /> : null}
            ></Route>
            <Route
              path="/admin"
              element={this.state.isAdmin ? <Admin /> : null}
            ></Route>
            <Route
              path="/detail/:name"
              element={<BookDetail onAdd={this.onAdd} />}
            ></Route>
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
                  setLogin={this.setLogin}
                  setCurrentUser={this.setCurrentUser}
                />
              }
            ></Route>
            <Route
              path="/register"
              element={<Register setNavbar={this.hiddenNavbar} />}
            ></Route>
            <Route
              path="/logout"
              element={
                <Logout
                  setAdmin={this.setAdmin}
                  setLogin={this.setLogin}
                />
              }
            ></Route>
            <Route
              path="/order"
              element={this.state.isAdmin ? <OrderInfor /> : null}
            ></Route>
            <Route
              path="/chat"
              element={<Chat currentUser={this.state.currentUser} isAdmin={this.state.isAdmin} />}
            ></Route>
          </Routes>
        </Router>
      </div>
    );
  }
}

const url = aws_config.aws_appsync_graphqlEndpoint;

const link = ApolloLink.from([
   createHttpLink({ uri: url })
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

const WithProvider = () => (
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>
);

export default WithProvider;
