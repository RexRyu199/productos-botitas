/**
 * botitasApi.js — Servicios asíncronos de Productos Botitas
 */

import emailjs from '@emailjs/browser'
import { products } from '../data/products'
import { supabase }      from '../lib/supabase'
import { mapProductRow } from '../utils/mapProduct'

// ─────────────────────────────────────────────────────────────
// FUNCIÓN 1 — fetchProducts
// RLS filtra automáticamente in_stock=true para visitantes
// no autenticados, sin necesidad de filtrar en el cliente.
// ─────────────────────────────────────────────────────────────
export async function fetchProducts(category = 'todos') {
  const { data, error } = await supabase.from('products').select('*').order('id')
  if (error) throw new Error('Error al cargar los productos')

  const mapped = data.map(mapProductRow)
  if (category === 'todos') return mapped

  const cleanCategory = category.trim().toLowerCase()
  return mapped.filter(p => p.category === cleanCategory)
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN 2 — fetchFeatured
// ─────────────────────────────────────────────────────────────
export async function fetchFeatured() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)

  if (error) throw new Error('Error al cargar destacados')
  return data.map(mapProductRow)
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN 3 — fetchWeather
// Coordenadas céntricas de San Luis Río Colorado, Sonora
// ─────────────────────────────────────────────────────────────
const LAT = 32.4631
const LON = -114.7772

const WMO_CODES = {
  0:  { desc: 'Despejado',             icon: '☀️'  },
  1:  { desc: 'Mayormente despejado', icon: '🌤️'  },
  2:  { desc: 'Parcialmente nublado', icon: '⛅'  },
  3:  { desc: 'Nublado',              icon: '☁️'  },
  45: { desc: 'Niebla',               icon: '🌫️'  },
  61: { desc: 'Lluvia ligera',        icon: '🌧️'  },
  80: { desc: 'Chubascos',           icon: '🌦️'  },
  95: { desc: 'Tormenta',            icon: '⛈️'  },
}

function getCondition(code) {
  return WMO_CODES[code] ?? { desc: 'Variable', icon: '🌡️' }
}

export async function fetchWeather() {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m` +
    `&timezone=America%2FHermosillo&forecast_days=1`

  const response = await fetch(url)
  if (!response.ok) throw new Error('No se pudo obtener el clima')

  const data = await response.json()
  const c = data.current
  const cond = getCondition(c.weathercode)

  return {
    temperatura: Math.round(c.temperature_2m),
    humedad:     c.relative_humidity_2m,
    viento:      Math.round(c.windspeed_10m),
    condicion:   cond.desc,
    icon:        cond.icon,
  }
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN 4 — submitContactForm
// ─────────────────────────────────────────────────────────────
export async function submitContactForm({ nombre, email, asunto, mensaje }) {
  if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
    throw new Error('Nombre, email y mensaje son obligatorios')
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    throw new Error('El formato del correo no es válido')
  }

  const result = await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACTO,
    {
      from_name:  nombre,
      from_email: email,
      asunto:     asunto.trim() || 'Sin asunto',
      message:    mensaje,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  )

  if (result.status !== 200) {
    throw new Error('No se pudo enviar el mensaje. Intenta de nuevo.')
  }

  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// FUNCIÓN 5 — fetchBusinessHours
// Horarios específicos de Productos Botitas
// ─────────────────────────────────────────────────────────────
export function fetchBusinessHours() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { dia: 'Lunes – Viernes', horario: '6:00 AM – 4:00 PM' },
      ])
    }, 300)
  })
}