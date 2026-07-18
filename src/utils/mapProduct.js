export function mapProductRow(row) {
  return {
    id:       row.id,
    category: row.category?.trim().toLowerCase(),
    name:     row.name,
    desc:     row.description,
    price:    Number(row.price),
    image:    row.image,
    featured: row.featured,
    inStock:  row.in_stock,
  }
}