import React, { Component } from "react";
import PropTypes from "prop-types";
import NewsItem from "../NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

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

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
    // Capitalize the category and set document title
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  // Helper function to capitalize the first letter of a string
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Fetch news when the component mounts
  async componentDidMount() {
    this.fetchNews();
  }

  // Fetch news data from the API
  fetchNews = async () => {
    this.setState({ loading: true });
    const { page } = this.state;
    const { pageSize, country, category } = this.props;

    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=34b6c822236847ada19ba98940635e8b&page=${page}&pageSize=${pageSize}`;
    try {
      const data = await fetch(url);
      if (!data.ok) throw new Error(`HTTP error! status: ${data.status}`);
      const parseData = await data.json();
      this.setState((prevState) => ({
        articles: [...prevState.articles, ...parseData.articles],
        totalResults: parseData.totalResults || 0,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  };

  // Fetch more data for Infinite Scroll
  fetchMoreData = async () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      this.fetchNews
    );
  };

  render() {
    const { articles, loading, totalResults } = this.state;
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: "40px 0px" }}>
          NewsMonkey - Top Headlines from {this.capitalizeFirstLetter(this.props.category)}
        </h1>
        {loading && <Spinner />}

        <InfiniteScroll
          dataLength={articles.length}
          next={this.fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="row">
            {articles.map((element) => (
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
        </InfiniteScroll>
      </div>
    );
  }
}

export default News;
