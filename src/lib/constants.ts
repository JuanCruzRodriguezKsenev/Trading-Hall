// src/lib/constants.ts

export interface EnchantmentDef {
  id: string;
  name: string;
  maxLevel: number;
  type: "armor" | "tool" | "weapon" | "bow" | "fishing" | "trident" | "special";
  appliesTo: string; // Texto descriptivo para la UI
}

export const MINECRAFT_ENCHANTS: EnchantmentDef[] = [
  // --- GENERAL / HERRAMIENTAS ---
  {
    id: "mending",
    name: "Reparación", // ✅ Cambiado
    maxLevel: 1,
    type: "special",
    appliesTo: "Todo",
  },
  {
    id: "unbreaking",
    name: "Irrompibilidad", // ✅ Cambiado
    maxLevel: 3,
    type: "special",
    appliesTo: "Todo",
  },
  {
    id: "efficiency",
    name: "Eficiencia",
    maxLevel: 5,
    type: "tool",
    appliesTo: "Picos, Hachas, Palas",
  },
  {
    id: "silk_touch",
    name: "Toque de Seda", // ✅ Cambiado
    maxLevel: 1,
    type: "tool",
    appliesTo: "Herramientas",
  },
  {
    id: "fortune",
    name: "Fortuna",
    maxLevel: 3,
    type: "tool",
    appliesTo: "Picos, Palas",
  },

  // --- ARMADURA ---
  {
    id: "protection",
    name: "Protección",
    maxLevel: 4,
    type: "armor",
    appliesTo: "Armadura",
  },
  {
    id: "fire_protection",
    name: "Prot. contra el Fuego",
    maxLevel: 4,
    type: "armor",
    appliesTo: "Armadura",
  },
  {
    id: "blast_protection",
    name: "Prot. contra Explosiones",
    maxLevel: 4,
    type: "armor",
    appliesTo: "Armadura",
  },
  {
    id: "projectile_protection",
    name: "Prot. contra Proyectiles",
    maxLevel: 4,
    type: "armor",
    appliesTo: "Armadura",
  },
  {
    id: "feather_falling",
    name: "Caída de Pluma",
    maxLevel: 4,
    type: "armor",
    appliesTo: "Botas",
  },
  {
    id: "respiration",
    name: "Respiración",
    maxLevel: 3,
    type: "armor",
    appliesTo: "Casco",
  },
  {
    id: "aqua_affinity",
    name: "Afinidad Acuática",
    maxLevel: 1,
    type: "armor",
    appliesTo: "Casco",
  },
  {
    id: "thorns",
    name: "Espinas", // ✅ Cambiado
    maxLevel: 3,
    type: "armor",
    appliesTo: "Armadura",
  },
  {
    id: "depth_strider",
    name: "Agilidad Acuática",
    maxLevel: 3,
    type: "armor",
    appliesTo: "Botas",
  },
  {
    id: "frost_walker",
    name: "Paso Helado",
    maxLevel: 2,
    type: "armor",
    appliesTo: "Botas",
  },
  {
    id: "swift_sneak",
    name: "Sigilo Rápido",
    maxLevel: 3,
    type: "armor",
    appliesTo: "Pantalones",
  },

  // --- ARMAS (ESPADA / HACHA) ---
  {
    id: "sharpness",
    name: "Filo", // ✅ Cambiado
    maxLevel: 5,
    type: "weapon",
    appliesTo: "Espada, Hacha",
  },
  {
    id: "smite",
    name: "Golpeo", // ✅ Cambiado
    maxLevel: 5,
    type: "weapon",
    appliesTo: "Espada",
  },
  {
    id: "bane_of_arthropods",
    name: "Perdición de los Artrópodos",
    maxLevel: 5,
    type: "weapon",
    appliesTo: "Espada",
  },
  {
    id: "knockback",
    name: "Empuje",
    maxLevel: 2,
    type: "weapon",
    appliesTo: "Espada",
  },
  {
    id: "fire_aspect",
    name: "Aspecto Ígneo",
    maxLevel: 2,
    type: "weapon",
    appliesTo: "Espada",
  },
  {
    id: "looting",
    name: "Botín", // ✅ Cambiado
    maxLevel: 3,
    type: "weapon",
    appliesTo: "Espada",
  },
  {
    id: "sweeping_edge",
    name: "Filo Arrasador",
    maxLevel: 3,
    type: "weapon",
    appliesTo: "Espada",
  },

  // --- ARCO / BALLESTA ---
  { id: "power", name: "Poder", maxLevel: 5, type: "bow", appliesTo: "Arco" },
  {
    id: "punch",
    name: "Retroceso",
    maxLevel: 2,
    type: "bow",
    appliesTo: "Arco",
  },
  { id: "flame", name: "Fuego", maxLevel: 1, type: "bow", appliesTo: "Arco" },
  {
    id: "infinity",
    name: "Infinidad",
    maxLevel: 1,
    type: "bow",
    appliesTo: "Arco",
  },
  {
    id: "multishot",
    name: "Multidisparo",
    maxLevel: 1,
    type: "bow",
    appliesTo: "Ballesta",
  },
  {
    id: "piercing",
    name: "Perforación",
    maxLevel: 4,
    type: "bow",
    appliesTo: "Ballesta",
  },
  {
    id: "quick_charge",
    name: "Carga Rápida",
    maxLevel: 3,
    type: "bow",
    appliesTo: "Ballesta",
  },

  // --- TRIDENTE ---
  {
    id: "loyalty",
    name: "Lealtad",
    maxLevel: 3,
    type: "trident",
    appliesTo: "Tridente",
  },
  {
    id: "impaling",
    name: "Empalamiento",
    maxLevel: 5,
    type: "trident",
    appliesTo: "Tridente",
  },
  {
    id: "riptide",
    name: "Propulsión Acuática",
    maxLevel: 3,
    type: "trident",
    appliesTo: "Tridente",
  },
  {
    id: "channeling",
    name: "Conductividad",
    maxLevel: 1,
    type: "trident",
    appliesTo: "Tridente",
  },

  // --- CAÑA DE PESCAR ---
  {
    id: "lure",
    name: "Atracción",
    maxLevel: 3,
    type: "fishing",
    appliesTo: "Caña",
  },
  {
    id: "luck_of_the_sea",
    name: "Suerte Marina",
    maxLevel: 3,
    type: "fishing",
    appliesTo: "Caña",
  },
];

// Helper para obtener datos rápidos por ID
export const ENCHANTMENT_DICT = Object.fromEntries(
  MINECRAFT_ENCHANTS.map((e) => [e.id, e])
);
