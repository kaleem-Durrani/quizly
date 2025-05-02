import { useState, useCallback, useEffect } from 'react';
import { PaginationParams } from '../constants/types';

/**
 * Custom hook for handling pagination
 * 
 * @param initialPage Initial page number
 * @param initialLimit Initial items per page
 * @param initialSearch Initial search term
 * @returns Pagination state and handlers
 */
const usePagination = (
  initialPage: number = 1,
  initialLimit: number = 10,
  initialSearch: string = ''
) => {
  // Pagination state
  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
    search: initialSearch,
  });
  
  // Total items count
  const [total, setTotal] = useState<number>(0);
  
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handle page change
   * @param page New page number
   */
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Handle items per page change
   * @param pageSize New items per page
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, limit: pageSize, page: 1 }));
  }, []);

  /**
   * Handle search term change
   * @param search New search term
   */
  const handleSearchChange = useCallback((search: string) => {
    setPagination((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  /**
   * Reset pagination to initial values
   */
  const resetPagination = useCallback(() => {
    setPagination({
      page: initialPage,
      limit: initialLimit,
      search: initialSearch,
    });
  }, [initialPage, initialLimit, initialSearch]);

  // Reset pagination when initial values change
  useEffect(() => {
    resetPagination();
  }, [initialPage, initialLimit, initialSearch, resetPagination]);

  return {
    pagination,
    total,
    loading,
    setTotal,
    setLoading,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    resetPagination,
  };
};

export default usePagination;

/* 
USAGE EXAMPLE:

import usePagination from '../hooks/usePagination';
import { useEffect } from 'react';
import { fetchItems } from '../api/someApi';

function ItemList() {
  const {
    pagination,
    total,
    loading,
    setTotal,
    setLoading,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  } = usePagination(1, 10);
  
  const [items, setItems] = useState([]);
  
  // Fetch items when pagination changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchItems(pagination);
        setItems(response.data);
        setTotal(response.pagination.totalDocs);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [pagination, setLoading, setTotal]);
  
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={pagination.search}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>...</thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>...</tr>
            ))}
          </tbody>
        </table>
      )}
      
      <Pagination
        current={pagination.page}
        pageSize={pagination.limit}
        total={total}
        onChange={handlePageChange}
        onShowSizeChange={(_, size) => handlePageSizeChange(size)}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
      />
    </div>
  );
}
*/
