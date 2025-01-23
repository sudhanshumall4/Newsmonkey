import React, { Component } from "react";

class NewsItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, author, date,source}=this.props; // Correctly destructured props
    return (
      <div className="my-3">
        <div className="card">
<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{left:'90%',zIndex:'1'}}>
        {source}</span>
          <img
            src={imageUrl || "https://via.placeholder.com/150"} // Fallback for missing imageUrl
            className="card-img-top"
            alt="News thumbnail"/>
<div className="card-body">
<h5 className="card-title">{title}
            </h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-body-secondary">
                By {author ? author : "unknown"} on{" "}
                {date ? new Date(date).toGMTString() : "N/A"}
              </small>
            </p>
            <a
              href={newsUrl}
              className="btn btn-sm btn-primary"
              target="_blank"
              rel="noopener noreferrer">Read more</a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsItem;
