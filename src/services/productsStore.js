/**
 * productsStore.js — CRUD de productos contra Supabase
 * Requiere sesión autenticada (RLS lo exige para
 * insert/update/delete).
 */
import { supabase }       from '../lib/supabase'
import { mapProductRow }  from '../utils/mapProduct'
import { deleteProductImage } from './imageUpload'

export async function getAllProducts() {
  const { data, error } = await supabase.from('products').select('*').order('id')
  if (error) throw new Error(error.message)
  return data.map(mapProductRow)
}

export async function addProduct(product) {
  if (!product.name?.trim()) throw new Error('El nombre es obligatorio')
  if (!product.category)     throw new Error('Selecciona una categoría')
  const price = parseFloat(product.price)
  if (isNaN(price) || price <= 0) throw new Error('El precio debe ser mayor a 0')

  const { data, error } = await supabase
    .from('products')
    .insert([{
      category:    product.category,
      name:        product.name.trim(),
      description: product.desc?.trim() || '',
      price,
      image: product.image?.trim() ||
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
      featured: !!product.featured,
      in_stock: product.inStock !== false,
    }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return mapProductRow(data)
}

export async function updateProduct(id, updates) {
  if (!updates.name?.trim()) throw new Error('El nombre es obligatorio')
  const price = parseFloat(updates.price)
  if (isNaN(price) || price <= 0) throw new Error('El precio debe ser mayor a 0')

  // Obtiene la imagen anterior para poder borrarla si cambió
  const { data: current } = await supabase
    .from('products')
    .select('image')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('products')
    .update({
      category:    updates.category,
      name:        updates.name.trim(),
      description: updates.desc?.trim() || '',
      price,
      image:       updates.image?.trim() || '',
      featured:    !!updates.featured,
      in_stock:    !!updates.inStock,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Si la imagen cambió, borra la anterior del storage
  if (current?.image && current.image !== updates.image && current.image.includes('product-images')) {
    try {
      await deleteProductImage(current.image)
    } catch (err) {
      console.warn('No se pudo borrar la imagen anterior:', err.message)
    }
  }

  return mapProductRow(data)
}

export async function deleteProduct(id) {
  // Primero obtenemos el producto para saber qué imagen borrar
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('image')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)

  // Borra la imagen del Storage solo si es una imagen subida por el panel
  // (evita error si el producto usaba una URL externa vieja tipo Unsplash)
  if (product?.image && product.image.includes('product-images')) {
    try {
      await deleteProductImage(product.image)
    } catch (err) {
      console.warn('No se pudo borrar la imagen del storage:', err.message)
    }
  }

  return { success: true }
}