/**
 * imageUpload.js — Sube imágenes de productos a Supabase Storage
 */
import { supabase } from '../lib/supabase'
import { validateImageFile } from '../utils/validation'

export async function uploadProductImage(file) {
  validateImageFile(file)

  const ext = file.name.split('.').pop().toLowerCase()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error('Error al subir la imagen: ' + error.message)

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function deleteProductImage(publicUrl) {
  // Extrae el nombre del archivo de la URL pública
  const fileName = publicUrl.split('/').pop()
  await supabase.storage.from('product-images').remove([fileName])
}