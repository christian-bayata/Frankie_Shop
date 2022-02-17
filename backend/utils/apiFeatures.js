class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  //The search method
  search() {
    //If the keyword exists, run a $regex on the it with case insensitive option
    //If not, return an empty object
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }
  //The filter method
  filter() {
    const queryCopy = { ...this.queryStr };

    //Removing fields from the query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    //Advanced filter for price and ratings
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    // console.log(queryCopy);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //The pagination method
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    //skip the products on the current page
    const skip = resPerPage * (currentPage - 1);

    // limit() takes one parameter - a number defining how many documents to return.
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
