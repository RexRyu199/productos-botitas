/**
 * products.js — Catálogo de productos de Productos Botitas
 *
 * Campos:
 * id        → número único (no repetir)
 * category  → 'botanas' | 'rines' | 'chetines' | 'bolis'
 * name      → nombre de la botana
 * desc      → descripción corta
 * price     → precio en pesos MXN (número)
 * image     → URL de imagen descriptiva
 * featured  → true si aparece en la sección Inicio
 * inStock   → true/false
 */

export const CATEGORIES = [
  { key: 'todos',    label: 'Todos los productos' },
  { key: 'botanas',  label: 'Botanas Fritas'      },
  { key: 'rines',    label: 'Rines y Churritos'   },
  { key: 'chetines', label: 'Chetines Especiales' },
  { key: 'bolis',    label: 'Bolis y Congelados'  },
]

export const products = [
  // ── BOTANAS FRITAS ──────────────────────────────────────────
  {
    id: 1,
    category: 'botanas',
    name: 'Papas Caseras con Sal y Limón',
    desc: 'Papas fritas artesanales crujientes, sazonadas con sal de grano y un toque de limón.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80',
    featured: true,
    inStock: true,
  },
  {
    id: 2,
    category: 'botanas',
    name: 'Chicharrón de Cerdo Crujiente',
    desc: 'Chicharrón esponjado y crujiente, ideal para acompañar con salsa picante.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
    featured: false,
    inStock: true,
  },
  {
    id: 3,
    category: 'botanas',
    name: 'Mix de Semillas Enchiladas',
    desc: 'Mezcla perfecta de cacahuates, habas y garbanzos tostados con chile de árbol.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?w=600&q=80',
    featured: true,
    inStock: true,
  },

  // ── RINES Y CHURRITOS ───────────────────────────────────────
  {
    id: 4,
    category: 'rines',
    name: 'Rines de Harina Clásicos',
    desc: 'La botana tradicional mexicana en forma de rueda, listos para tu salsa favorita.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1534080391095-71b1454625e1?w=600&q=80',
    featured: true,
    inStock: true,
  },
  {
    id: 5,
    category: 'rines',
    name: 'Lagrimitas Picantes',
    desc: 'Frituras de harina crujientes en barra alargada sazonadas con chile en polvo.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1621996346565-e3bb646459a6?w=600&q=80',
    featured: false,
    inStock: true,
  },
  {
    id: 6,
    category: 'rines',
    name: 'Churritos de Maíz con Limón',
    desc: 'Churritos delgados y crujientes hechos a base de maíz con un toque ácido y sal.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
    featured: true,
    inStock: true,
  },

  // ── CHETINES ───────────────────────────────────────────────
  {
    id: 7,
    category: 'chetines',
    name: 'Chetines Colmillo Fuego',
    desc: 'Botana horneada de maíz con una cobertura intensa de chile picante y queso.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600&q=80',
    featured: true,
    inStock: true,
  },
  {
    id: 8,
    category: 'chetines',
    name: 'Chetines de Queso Tradicional',
    desc: 'Los clásicos de maíz inflado con un delicioso y abundante sabor a queso cheddar.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
    featured: false,
    inStock: false,
  },

  // ── BOLIS Y CONGELADOS ──────────────────────────────────────
  {
    id: 9,
    category: 'bolis',
    name: 'Bolis Premium de Rompope',
    desc: 'Hielito cremoso sabor rompope artesanal, ideal para refrescar el día.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=600&q=80',
    featured: true,
    inStock: true,
  },
  {
    id: 10,
    category: 'bolis',
    name: 'Bolis de Fresa Natural con Leche',
    desc: 'Congelado cremoso elaborado con fresas naturales seleccionadas.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    featured: false,
    inStock: true,
  },
  {
    id: 11,
    category: 'bolis',
    name: 'Bolis de Mango con Chamoy',
    desc: 'Combinación refrescante y frutal de mango con el toque acidito del chamoy.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1546173159-315724a13696?w=600&q=80',
    featured: true,
    inStock: true,
  },
]