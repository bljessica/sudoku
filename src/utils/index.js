export const getBlockCeilKey = (i, j) => {
  const rowIdx = Math.floor((i - 1) / 3) * 3 + Math.ceil(j / 3)
  const colIdx = (i - Math.floor((i - 1) / 3) * 3 - 1) * 3 + j - Math.floor((j - 1) / 3) * 3
  return [rowIdx - 1, colIdx - 1]
}