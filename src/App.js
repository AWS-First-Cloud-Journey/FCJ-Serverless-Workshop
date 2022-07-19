import React, {Component} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Mainpage from './component/Mainpage/Mainpage'
import Navigation from './component/Header/Navigation'
import UploadBook from './component/Upload/UploadBook';
import UpdateBook from './component/Update/UpdateBook';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        updateBook: {
            id: "",
            name: "",
            author: "",
            description: ""
        }
    }
  }
  getUpdateBook = (updateBook) => {
    this.setState({updateBook: updateBook})
  }
  render() {
    return (
      <div>    
        <Router>
        <Navigation></Navigation>
        <Routes>
          <Route exact path="/" element={<Mainpage selectBook={this.getUpdateBook}/>}></Route>
          <Route path="/upload" element={<UploadBook/>}></Route>
          <Route path="/update" element={<UpdateBook inforBook={this.state.updateBook}/>}></Route>
        </Routes>
        </Router>
      </div>
    )
  }
}
export default App;