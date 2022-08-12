import { useNavigate } from "react-router-dom";
import React, {useEffect} from 'react'
import axios from 'axios';
import config from '../../config'
import ReactPaginate from 'react-paginate'

function Admin() {
    const [books, setBooks] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [newsPerPage, setNewsPerPage] = React.useState(4);
    const navigate = useNavigate();

    useEffect( () => {
        axios({
            method: 'get',
            url: `${config.APP_API_URL}/books`,
        })
        .then(res => {
            setBooks(res.data)
        })
        .catch(err => { 
            console.log(err); 
        });
    }, []) ;


    const navigateToUpdate = (index, e) => {
        const updateBook = books[index]
        navigate('/update', {state: updateBook});
    };

    const setDataForPage = () => {
        const indexOfLastNews = currentPage * newsPerPage;
        const indexOfFirstNews = indexOfLastNews - newsPerPage;
        const currentPageData = books.slice(indexOfFirstNews, indexOfLastNews);

        return currentPageData;
    }

    const handlePageClick = (data) => {
        console.log("selectedPage", data.selected)
        setCurrentPage(
            data.selected + 1
        )
    }
    //loadDataFromServer()
    let currentPageData = setDataForPage();
    var elements = currentPageData.map((book, index) => { 
            return  <div className="col-md-3">
                        <div className="container p-3 my-3 border" >
                            <img src={book.image} alt="book_image" className="img-fluid mx-auto d-block " style={{maxHeight : '300px'}} />
                            <div className="caption" id={book.id}>
                                <h5>{book.name}</h5>
                                <h6>{book.author}</h6>
                            </div>
                            <div className="mt-3">
                                <button type="button" className="btn btn-outline-primary" onClick={() => navigateToUpdate(index)} >Update</button>
                            </div>
                        </div>
                    </div>
        });
        const pageNumbers = Math.ceil(books.length / newsPerPage);
        
        return(
            <div className="container pt-2">
                <div className="row">
                    { elements }
                </div>
                <ReactPaginate
                    previousLabel={"< Previous"}
                    nextLabel={"Next >"}
                    pageCount={pageNumbers}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    nextClassName={"page-item"}
                    activeClassName={"active"}>
                </ReactPaginate>
            </div>

        )
}

export default Admin