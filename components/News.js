import React, { Component } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import NewsItem from "../NewsItem";
import Spinner from "./Spinner";

export class News extends Component {
  // Default props
  static defaultProps = {
   country: "in",
    pageSize: 8,
    category: "general",
  };

  // Prop types
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
  }

  async componentDidMount() {
    this.fetchNews();
  }

  fetchNews = async () => {
    this.setState({ loading: true });
    const { page } = this.state;
    const { pageSize, country, category } = this.props;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=34b6c822236847ada19ba98940635e8b&page=${page}&pageSize=${pageSize}`;
    try {
      const data = await fetch(url);
      const parseData = await data.json();
      this.setState({
        articles: parseData.articles || [],
        totalResults: parseData.totalResults || 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  };

  handlePreviousClick = () => {
    this.setState(
      (prevState) => ({ page: prevState.page - 1 }),
      this.fetchNews
    );
  };

  handleNextClick = () => {
    const { page, totalResults } = this.state;
    const { pageSize } = this.props;
    const totalPages = Math.ceil(totalResults / pageSize);

    if (page + 1 > totalPages) {
      console.log("No more pages to fetch.");
      return;
    }

    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      this.fetchNews
    );
  };

  render() {
    const { articles, loading, page, totalResults } = this.state;
    const { pageSize } = this.props;
    const totalPages = Math.ceil(totalResults / pageSize);

    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin:'40px 0px'}}>NewsMonkey - Top Headlines</h1>
        {/* Display Spinner if loading */}
        {loading && <Spinner />}
        <div className="row">
          {!loading &&
            articles.map((element) => (
            <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={
                    element.title
                      ? element.title.slice(0, 45)
                      : "No Title Available"
                  }
                  description={
                    element.description
                      ? element.description.slice(0, 88)
                      : "No Description Available"
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
        </div>
        <div className="container d-flex justify-content-between my-3">
          <button
            disabled={page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePreviousClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={page >= totalPages}
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
