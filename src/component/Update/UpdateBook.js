import React, {Component} from 'react'
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import config from '../../config'

class UpdateBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
                id: "",
                name: "",
                author: "",
                description: "",
                fileToUpdate: undefined,
                // updateSuccess: undefined,
                // error: undefined
        }
    }

    componentDidMount() {
        this.setState({ id: this.props.inforBook.id});
        this.setState({ name: this.props.inforBook.name});
        this.setState({ author: this.props.inforBook.author});
        this.setState({ description: this.props.inforBook.description});
    }

    // updateBook = () => {
    //     let content_type = "";
    //     let updateImage = undefined;
    //     if (this.state.fileToUpdate){
    //         content_type = "multipart/form-data"
    //         updateImage = this.state.fileToUpdate
    //     }
    //     else
    //     {
    //         content_type = "application/json"
    //         updateImage = this.props.inforBook.image
    //     }
    //     axios({
    //         method: 'post',
    //         url: config.APP_API_URL,
    //         data: {
    //             id : this.state.id,
    //             name: this.state.name,
    //             author: this.state.author,
    //             description: this.state.description,
    //             image : updateImage
    //         },
    //         headers: { "Content-Type": content_type }
    //     })
    //     .then(res => {
    //         this.setState({
    //             updateSuccess: "Book update successfull",
    //             error: undefined
    //         });
    //     })
    //     .catch(err => {
    //         this.setState({
    //             error: "Error Occured while update the book",
    //             updateSuccess: undefined
    //         });
    //     });
    // }

    // deleteBook = () => {
    //     axios({
    //         method: 'delete',
    //         url: `${config.APP_API_URL}/${this.props.inforBook.id}`,
    //     })
    //     .then(res => {
    //         this.setState({
    //             updateSuccess: "Book delete successfull",
    //             error: undefined
    //         });
    //     })
    //     .catch(err => {
    //         this.setState({
    //             error: "Error Occured while update the book",
    //             updateSuccess: undefined
    //         });
    //     });
    // }
    
    redirectPage = () => {
        this.props.navigate('/');
    }

    handleUpdateBook = async (e) => {
        e.preventDefault();

        let formIsValid = true;
        if (!this.state.id || !this.state.name || !this.state.author){
            formIsValid = false;
        }

        if (formIsValid){
            let content_type = "";
            let updateImage = undefined;
            if (this.state.fileToUpdate){
                content_type = "multipart/form-data"
                updateImage = this.state.fileToUpdate
            }
            else
            {
                content_type = "application/json"
                updateImage = this.props.inforBook.image
            }
            try {
                const response = await axios({
                    method: 'post',
                    url: config.APP_API_URL,
                    data: {
                        id : this.state.id,
                        name: this.state.name,
                        author: this.state.author,
                        description: this.state.description,
                        image : updateImage
                    },
                    headers: { "Content-Type": content_type }
                })
                const status = response.status
                if (status === 200)
                {
                    alert("Book delete successfull")
                    this.redirectPage();
                }
                else
                {
                    alert("Error Occured while update the book")
                }
            }
            catch {
                alert("Error Occured while update the book")
            }
        }
        else
        {
            alert("The id, name or author not entered")
        }
    }
    handleDeleteBook = async (e) =>{
        e.preventDefault();

        try{
            const response = await axios({
                method: 'delete',
                url: `${config.APP_API_URL}/${this.props.inforBook.id}`,
            })
            const status = response.status
            if (status === 200)
            {
                alert("Book delete successfull")
                this.redirectPage();
            }
            else
            {
                alert("Error Occured while delete the book")
            }
        }
        catch
        {
            alert("Error Occured while delete the book")
        }

    }

    render()
    {
        return <div className="container p-5 my-5 border ">
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">ID</label>
                    <input type="text" className="form-control" onChange={(e) => this.setState({ id: e.target.value })} value={this.props.inforBook.id} placeholder="ID of book" required></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Name</label>
                    <input type="text" onChange={(e) => this.setState({ name: e.target.value })} defaultValue={this.props.inforBook.name} className="form-control" placeholder="Book name" required></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Author</label>
                    <input type="text" onChange={(e) => this.setState({ author: e.target.value })} defaultValue={this.props.inforBook.author} className="form-control" placeholder="Author book"></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Description</label>
                    <textarea className="form-control" onChange={(e) => this.setState({ description: e.target.value })} defaultValue={this.props.inforBook.description} rows="3"></textarea>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Select image:</label>
                    <input className="form-control" type="file" id="img" name="img" accept="image/*" onChange={(e) => this.setState({ fileToUpdate: e.target.files[0] })} ></input>
                </div>
                <div>
                    <button type="button" className="btn btn-outline-primary" onClick={this.handleUpdateBook} >Update</button>
                    <button type="button" className="btn btn-outline-danger" onClick={this.handleDeleteBook} >Delete</button>
                </div>
            </div>
    }
}

function WithNavigate(props) {
    let navigate = useNavigate();
    return <UpdateBook {...props} navigate={navigate} />
}

export default WithNavigate;