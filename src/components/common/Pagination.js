import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PageSize = 5;
const PaginationLimit = 7;

export const Pagination = ({ totalCount, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / PageSize);

  const paginationRange = useMemo(() => {
    let startPage;
    let endPage;

    if (totalPages <= PaginationLimit) {
      // Jika jumlah halaman kurang dari atau sama dengan batas pagination
      startPage = 1;
      endPage = totalPages;
    } else {
      // Jika jumlah halaman lebih dari batas pagination
      const pageOffset = Math.floor(PaginationLimit / 2);
      if (currentPage <= pageOffset) {
        // Halaman awal
        startPage = 1;
        endPage = PaginationLimit;
      } else if (currentPage >= totalPages - pageOffset) {
        // Halaman akhir
        startPage = totalPages - PaginationLimit + 1;
        endPage = totalPages;
      } else {
        // Halaman tengah
        startPage = currentPage - pageOffset;
        endPage = currentPage + pageOffset;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [totalCount, currentPage]);

  const renderPaginationItems = () => {
    return paginationRange.map((page, index) => {
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationItem,
            currentPage === page && styles.selected,
          ]}
          onPress={() => onPageChange(page)}
        >
          <Text
            style={[
              styles.paginationText,
              currentPage === page && styles.selectedText,
            ]}
          >
            {page}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.paginationItem}
        onPress={() => onPageChange(1)}
      >
        <Text style={styles.paginationText}>First</Text>
      </TouchableOpacity>
      {renderPaginationItems()}
      <TouchableOpacity
        style={styles.paginationItem}
        onPress={() => onPageChange(totalPages)}
      >
        <Text style={styles.paginationText}>Last</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationItem: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    backgroundColor: '#ccc',
  },
  paginationText: {
    fontSize: 16,
    color: 'black',
  },
  selected: {
    backgroundColor: 'blue',
  },
  selectedText: {
    color: 'white',
  },
});
