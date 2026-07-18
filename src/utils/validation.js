/**
 * validation.js — Reglas de validación y seguridad
 * usadas en formularios de productos y contacto.
 */

export const LIMITS = {
  productName:  60,
  productDesc:  280,
  contactName:  60,
  contactEmail: 100,
  contactPhone: 20,
  contactSubject: 80,
  contactMessage: 600,
  categoryLabel: 40,
}

export const IMAGE_RULES = {
  maxSizeBytes: 3 * 1024 * 1024, // 3 MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
}

export function validateImageFile(file) {
  if (!file) throw new Error('No se seleccionó ninguna imagen')

  if (!IMAGE_RULES.allowedTypes.includes(file.type)) {
    throw new Error('Solo se permiten imágenes JPG, PNG o WEBP')
  }

  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!IMAGE_RULES.allowedExtensions.includes(ext)) {
    throw new Error('Extensión de archivo no permitida')
  }

  if (file.size > IMAGE_RULES.maxSizeBytes) {
    throw new Error('La imagen no debe pesar más de 3 MB')
  }

  return true
}

// Sanea texto: quita etiquetas HTML y recorta longitud
export function sanitizeText(text, maxLength) {
  if (!text) return ''
  const stripped = text.replace(/<[^>]*>/g, '') // quita tags HTML
  return stripped.slice(0, maxLength).trim()
}