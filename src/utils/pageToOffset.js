

export const pageToOffset = (pageNumber = 1, rowsPerPage) => {
  return (pageNumber - 1) * rowsPerPage
} 