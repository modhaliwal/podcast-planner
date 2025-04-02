
import { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxDisplayedPages?: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxDisplayedPages = 5,
}: PaginationControlsProps) {
  // Calculate which pages to display
  const pageNumbers = useMemo(() => {
    if (totalPages <= maxDisplayedPages) {
      // If we have fewer pages than the max to display, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first page, last page, current page, and some neighbors
    const pageNumbers = new Set<number>();
    
    // Always add first and last page
    pageNumbers.add(1);
    pageNumbers.add(totalPages);
    
    // Add current page and one neighbor on each side
    const startNeighbor = Math.max(2, currentPage - 1);
    const endNeighbor = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startNeighbor; i <= endNeighbor; i++) {
      pageNumbers.add(i);
    }
    
    // Convert to sorted array
    return Array.from(pageNumbers).sort((a, b) => a - b);
  }, [currentPage, totalPages, maxDisplayedPages]);

  // No pagination needed for 0 or 1 pages
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        
        {/* Page numbers with ellipsis */}
        {pageNumbers.map((pageNumber, index) => {
          // If there's a gap in the sequence, add ellipsis
          const previousPageNumber = pageNumbers[index - 1];
          const needsEllipsisBefore = previousPageNumber && pageNumber - previousPageNumber > 1;
          
          return (
            <div key={pageNumber} className="flex items-center">
              {needsEllipsisBefore && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationLink
                  isActive={pageNumber === currentPage}
                  onClick={() => onPageChange(pageNumber)}
                  className="cursor-pointer"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            </div>
          );
        })}
        
        {/* Next button */}
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
