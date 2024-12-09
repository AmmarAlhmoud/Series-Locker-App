import React from "react";
import { useSearchParams } from "react-router-dom";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const PaginationItem = ({ dataCount }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = searchParams.get("page") || "1";

  const handlePageChange = (page) => {
    setSearchParams({
      page,
    });
  };

  return (
    <Pagination
      current={pageNumber}
      total={dataCount}
      pageSize={12}
      onChange={handlePageChange}
    />
  );
};

export default PaginationItem;
