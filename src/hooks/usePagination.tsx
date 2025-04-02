
import { useState, useCallback, useMemo } from 'react';

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
}

export function usePagination({ 
  initialPage = 1, 
  initialPageSize = 10, 
  totalItems 
}: PaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);
  
  // Ensure current page is valid when total changes
  const safeCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, totalPages));
  }, [currentPage, totalPages]);
  
  // Pagination change handlers
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  }, [safeCurrentPage, totalPages]);
  
  const previousPage = useCallback(() => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  }, [safeCurrentPage]);
  
  const changePageSize = useCallback((newSize: number) => {
    // When changing page size, try to keep the same items visible
    const firstItemIndex = (safeCurrentPage - 1) * pageSize;
    const newPage = Math.floor(firstItemIndex / newSize) + 1;
    
    setPageSize(newSize);
    setCurrentPage(newPage);
  }, [safeCurrentPage, pageSize]);
  
  // Calculate pagination info
  const { startIndex, endIndex } = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    const end = Math.min(start + pageSize - 1, totalItems - 1);
    return { startIndex: start, endIndex: end };
  }, [safeCurrentPage, pageSize, totalItems]);
  
  // Helper function to get paginated data from an array
  // Fix: Use a proper generic type parameter with a trailing comma
  const paginateData = useCallback(<T,>(data: T[]): T[] => {
    return data.slice(startIndex, endIndex + 1);
  }, [startIndex, endIndex]);
  
  return {
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    changePageSize,
    paginateData
  };
}
