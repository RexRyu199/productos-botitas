import { supabase } from '../lib/supabase'
import { sanitizeText } from '../utils/validation'
import { deleteProductImage } from './imageUpload'

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) throw new Error(error.message)

  // Normaliza key para evitar mismatches por espacios o mayúsculas
  return data.map(c => ({ ...c, key: c.key.trim().toLowerCase() }))
}

export async function addCategory({ key, label, image }) {
  const cleanKey   = sanitizeText(key, 30).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const cleanLabel = sanitizeText(label, 40)

  if (!cleanKey || !cleanLabel) throw new Error('Clave y nombre son obligatorios')

  const { data, error } = await supabase
    .from('categories')
    .insert([{ key: cleanKey, label: cleanLabel, image: image || null }])
    .select()
    .single()

  if (error) {
    if (error.code === '23505') throw new Error('Ya existe una categoría con esa clave')
    throw new Error(error.message)
  }
  return data
}

export async function updateCategory(id, { label, image }) {
  const cleanLabel = sanitizeText(label, 40)
  if (!cleanLabel) throw new Error('El nombre es obligatorio')

  const { data: current } = await supabase
    .from('categories')
    .select('image')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('categories')
    .update({ label: cleanLabel, image: image !== undefined ? image : undefined })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (current?.image && current.image !== image && current.image.includes('product-images')) {
    try {
      await deleteProductImage(current.image)
    } catch (err) {
      console.warn('No se pudo borrar la imagen anterior:', err.message)
    }
  }

  return data
}

export async function deleteCategory(id, categoryKey) {
  const { data: inUse } = await supabase
    .from('products')
    .select('id, name')
    .eq('category', categoryKey)

  if (inUse && inUse.length > 0) {
    const count = inUse.length
    throw new Error(
      `No puedes eliminar esta categoría porque tiene ${count} producto${count !== 1 ? 's' : ''} asignado${count !== 1 ? 's' : ''}. ` +
      `Elimina o reasigna esos productos primero desde la tabla de arriba.`
    )
  }

  const { data: category, error: fetchError } = await supabase
    .from('categories')
    .select('image')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)

  if (category?.image && category.image.includes('product-images')) {
    try {
      await deleteProductImage(category.image)
    } catch (err) {
      console.warn('No se pudo borrar la imagen del storage:', err.message)
    }
  }

  return { success: true }
}