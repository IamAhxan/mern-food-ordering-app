import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="list-none p-0 m-0">
      {page !== 1 && (
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => onPageChange(page - 1)} />
        </PaginationItem>
      )}
      {pageNumbers.map((number) => (
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => onPageChange(number)}
            isActive={page === number}
          >
            {number}
          </PaginationLink>
        </PaginationItem>
      ))}
      {page !== pageNumbers.length && (
        <PaginationItem>
          <PaginationNext href="#" onClick={() => onPageChange(page + 1)} />
        </PaginationItem>
      )}
    </Pagination>
  );
};

export default PaginationSelector;
