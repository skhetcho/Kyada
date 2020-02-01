import React from "react";
import PropTypes from "prop-types";
import { Pagination, PaginationItem, Button } from 'reactstrap';


const defaultButton = props => <button {...props}>{props.children}</button>;

export default class pagination extends React.Component {
  constructor(props) {
    super();

    this.changePage = this.changePage.bind(this);

    this.state = {
      visiblePages: this.getVisiblePages(null, props.pages)
    };
  }

  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    // PaginationItem: PropTypes.any,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pages !== nextProps.pages) {
      this.setState({
        visiblePages: this.getVisiblePages(null, nextProps.pages)
      });
    }

    this.changePage(nextProps.page + 1);
  }

  filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter(page => page <= totalPages);
  };

  getVisiblePages = (page, total) => {
    if (total < 7) {
      return this.filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  changePage(page) {
    const activePage = this.props.page + 1;

    if (page === activePage) {
      return;
    }

    const visiblePages = this.getVisiblePages(page, this.props.pages);

    this.setState({
      visiblePages: this.filterPages(visiblePages, this.props.pages)
    });

    this.props.onPageChange(page - 1);
  }

  render() {
    // const { PaginationItem = defaultButton } = this.props;
    const { visiblePages } = this.state;
    const activePage = this.props.page + 1;

    return (
      <Pagination>
        <div>
          <Button
            color="info"
            onClick={() => {
              if (activePage === 1) return;
              this.changePage(1);
            }}
            disabled={activePage === 1}
          >
            {`<<`}
          </Button>
        </div>
        <div>
          <Button
            color="info"
            onClick={() => {
              if (activePage === 1) return;
              this.changePage(activePage - 1);
            }}
            disabled={activePage === 1}
          >
            {/* {this.props.previousText} */}
            {`<`}
          </Button>
        </div>
        <div>
          {visiblePages.map((page, index, array) => {
            return (
              <PaginationItem
                color="info"
                key={page}
                active={activePage === page ? true : false}
                className={
                  activePage === page
                    ? "Table__pageButton Table__pageButton--active"
                    : "Table__pageButton"
                }
                onClick={this.changePage.bind(null, page)}
              >
                {array[index - 1] + 2 < page ? `...${page}` : page}
              </PaginationItem>
            );
          })}
        </div>
        <div>
          <Button
            color="info"
            onClick={() => {
              if (activePage === this.props.pages) return;
              this.changePage(activePage + 1);
            }}
            disabled={activePage === this.props.pages}
          >
            {/* {this.props.nextText} */}
            {`>`}
          </Button>
        </div>
        <div>
          <Button
            color="info"
            onClick={() => {
              if (activePage === this.props.pages) return;
              this.changePage(this.props.pages);
            }}
            disabled={activePage === this.props.pages}
          >
            {`>>`}
          </Button>
        </div>
      </Pagination>
    );
  }
}
