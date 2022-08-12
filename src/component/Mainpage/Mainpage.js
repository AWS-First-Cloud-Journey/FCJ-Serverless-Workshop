import { useNavigate } from "react-router-dom";
import React, {useEffect} from 'react'
import axios from 'axios';
import config from '../../config'
import ReactPaginate from 'react-paginate'

function Mainpage(props) {
    const navigate = useNavigate();
    const [books, setBooks] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [newsPerPage, setNewsPerPage] = React.useState(4);

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
    
    const navigateToDetailPage = (index, e) => {
        const itemBook = books[index]
        navigate(`/detail/${itemBook.name}`, {state: itemBook})
    };

    const setDataForPage = () => {
        const indexOfLastNews = currentPage * newsPerPage;
        const indexOfFirstNews = indexOfLastNews - newsPerPage;
        const currentPageData = books.slice(indexOfFirstNews, indexOfLastNews);
        console.log(books)
        return currentPageData;
    }

    const handlePageClick = (data) => {
        console.log("selectedPage", data.selected)
        setCurrentPage(
            data.selected + 1
        )
    }

    let currentPageData = setDataForPage();
    var elements = currentPageData.map((book, index) => { 
        return  <div className="col-md-3" key={book.id}>
                    <div className="container p-3 my-3 border" >
                        <img src={book.image} alt="book_image" className="img-fluid mx-auto d-block mb-3" style={{maxHeight : '300px'}} onClick={() => navigateToDetailPage(index)}/>
                        <div className="caption" id={book.id}>
                            <h5>{book.name}</h5>
                            <h6>{book.author}</h6>
                            <div>${Number(book.price).toFixed(2)}</div>
                        </div>
                        <div className="mt-3">
                            <button type="button" className="btn btn-warning" onClick={() => props.onAdd(book)}>Add to cart</button>
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

export default Mainpage;
