import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import config from '../../config'

function UpdateBook(){
    const location = useLocation();
    const [id, setId] = React.useState(location.state.id);
    const [name, setName] = React.useState(location.state.name);
    const [author, setAuthor] = React.useState(location.state.author);
    const [price, setPrice] = React.useState(location.state.price);
    const [description, setDescription] = React.useState(location.state.description);
    const [fileToUpdate, setFileToUpdate] = React.useState(undefined)
    const navigate = useNavigate();
    //console.log(location.state)
    const redirectPage = () => {
        navigate('/admin');
    }

    async function handleUpdateBook(e) {
        e.preventDefault();

        let formIsValid = true;
        if (!id || !name || !author){
            formIsValid = false;
        }

        if (formIsValid){
            let content_type = "";
            let updateImage = undefined;
            if (fileToUpdate){
                content_type = "multipart/form-data"
                updateImage = fileToUpdate
            }
            else
            {
                content_type = "application/json"
                updateImage = location.state.image
            }
            try {
                const response = await axios({
                    method: 'post',
                    url: `${config.APP_API_URL}/books`,
                    data: {
                        id : id,
                        name: name,
                        author: author,
                        description: description,
                        price: price,
                        image : updateImage
                    },
                    headers: { "Content-Type": content_type }
                })
                const status = response.status
                if (status === 200)
                {
                    alert("Book update successfull")
                    redirectPage();
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

    const onConfirm = async () => {
        try{
            const response = await axios({
                method: 'delete',
                url: `${config.APP_API_URL}/books/${id}`,
            })
            const status = response.status
            if (status === 200)
            {
                alert("Book delete successfull")
                redirectPage();
            }
            else
            {
                alert("Error Occured while delete the book")
            }
        }
        catch (e)
        {
            console.log(e)
            alert("Error Occured while delete the book")
        }
    }

    const onCancel = () => {
        return;
    }

    function handleDeleteBook(e){
        e.preventDefault();
        window.confirm('Are you sure you wish to delete this item?') ? onConfirm("confirm") : onCancel("cancel")
    }

    return (
        <div className="container p-5 my-5 border ">
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">ID</label>
                    <input type="text" className="form-control" onChange={(e) => setId( e.target.value )} value={id} placeholder="ID of book" required></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Name</label>
                    <input type="text" onChange={(e) => setName(e.target.value )}  className="form-control" defaultValue={name}  placeholder="Book name" required></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Author</label>
                    <input type="text" onChange={(e) => setAuthor(e.target.value)} className="form-control" defaultValue={author}  placeholder="Author book"></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Price</label>
                    <input type="text" onChange={(e) => setPrice(e.target.value )} className="form-control" defaultValue={price}  placeholder="Price book"></input>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Description</label>
                    <textarea className="form-control" onChange={(e) => setDescription(e.target.value)} defaultValue={description} rows="3"></textarea>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Select image:</label>
                    <input className="form-control" type="file" id="img" name="img" accept="image/*" onChange={(e) => setFileToUpdate(e.target.files[0])} ></input>
                </div>
                <div>
                    <button type="button" className="btn btn-outline-primary" onClick={handleUpdateBook} >Update</button>
                    <button type="button" className="btn btn-outline-danger" onClick={handleDeleteBook} >Delete</button>
                </div>
        </div>
    )
}

export default UpdateBook