import React from "react";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};
function BookDetail(props) {
  const location = useLocation();
  const book = location.state;
  const stars = Array(5).fill(0);

  var comments = book.comments.map((comment) => {
    return (
      <div className="col-">
        <ul className="list-group list-group-flush">
          <div className="col- mb-2">
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={24}
                  color={comment.star > index ? colors.orange : colors.grey}
                ></FaStar>
              );
            })}
          </div>
          <p>{comment.rv}</p>
        </ul>
        <hr />
      </div>
    );
  });
  return (
    <div className="container pt-5">
      <div className="d-flex justify-content-center mb-5">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4">
              <img
                src={book.image}
                alt="book_image"
                className="img-fluid mx-auto d-block "
              />
            </div>
            <div className="col-md-8">
              <ul className="list-group list-group-flush">
                <h3>{book.name}</h3>
                <h5>{book.author}</h5>
                <p>{book.description}</p>
                <span className="mb-3">${book.price}</span>
                <span className="mb-5">{book.category}</span>
                <button
                  type="button"
                  className="btn btn-warning btn-lg btn-block col-6"
                  onClick={() => props.onAdd(book)}
                >
                  Add to cart
                </button>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="col-md-12">
          <h3>Review</h3>
          <hr/>
          {comments}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
