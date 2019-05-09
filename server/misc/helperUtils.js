export default {
  paginateData: (data, page = 1, limit) => {
    limit = limit || data.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return data.slice(startIndex, endIndex);
  }
};
