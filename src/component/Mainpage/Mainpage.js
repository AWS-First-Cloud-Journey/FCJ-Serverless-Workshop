import { useNavigate } from "react-router-dom";
import React, {Component} from 'react'
import axios from 'axios';
import config from '../../config'

class Mainpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            updateBook: {
                id: "",
                name: "",
                author: "",
                description: "",
                image: ""
            }
        }
    }

    navigateToUpdate(index, e) {
        // 👇️ navigate to /contacts
        this.state.updateBook.id = this.state.books[index].id;
        this.state.updateBook.name = this.state.books[index].name;
        this.state.updateBook.author = this.state.books[index].author;
        this.state.updateBook.description = this.state.books[index].description;
        this.state.updateBook.image = this.state.books[index].image;

        this.props.selectBook(this.state.updateBook)

        this.props.navigate('/update');
    };
    componentDidMount() {
        // await fetch("https://5vw2ufurrk.execute-api.us-east-2.amazonaws.com/staging/books", {
        // })
        // .then(response => response.json())
        // .then(response => {
        //     this.setState({
        //         books: response
        //     })
        // })
        axios({
            method: 'get',
            url: config.APP_API_URL,
        })
        .then(res => {
            console.log(res.data);
            this.setState({
                books: res.data
                })
        })
        .catch(err => { 
            console.log(err); 
        });
    }

    render() {
        var elements = this.state.books.map((book, index) => { 
            return  <div className="col-3">
                        <div className="container p-3 my-3 border" > 
                            <img src={book.image} alt="book_image" className="img-fluid mx-auto d-block " style={{maxHeight : '300px'}}/>
                            <div className="caption" id={book.id}>
                                <h5>{book.name}</h5>
                                <h6>{book.author}</h6>
                                <p>
                                   {book.description}
                                </p>
                            </div>
                            <div>
                                <button type="button" className="btn btn-outline-primary" onClick={this.navigateToUpdate.bind(this, index)} >Update</button>
                            </div>
                        </div>
                    </div>
        });
        return(
            <div className="container pt-2">
                <div className="row">
                    { elements }
                </div>
            </div>

        )
    }
    
}

function WithNavigate(props) {
    let navigate = useNavigate();
    return <Mainpage {...props} navigate={navigate} />
}

export default WithNavigate;