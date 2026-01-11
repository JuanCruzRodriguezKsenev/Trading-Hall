import { PrismaClient, Prisma } from "@/app/generated/prisma/client"; // Usamos el cliente estándar
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// 1. Configuración de conexión con Neon (igual que en tu app)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// 2. Definimos los datos MOCK usando el tipo estricto de Prisma
const userData: Prisma.UserCreateInput[] = [
  {
    username: "Admin",
    password: "123", // Contraseña simple para pruebas
    // Relación: Creamos los mundos vinculados a este usuario
    worlds: {
      create: [
        {
          name: "Survival Server", // Nombre del Mundo
          // Relación: Creamos los encantamientos dentro de este mundo
          enchantments: {
            create: [
              {
                enchantmentId: "mending",
                level: 1,
                price: 12,
                villagerId: "Librero Pantano",
                modifiedBy: "Admin",
              },
              {
                enchantmentId: "unbreaking",
                level: 3,
                price: 24,
                villagerId: "Aldeano Hall Central",
                modifiedBy: "Admin",
              },
              {
                enchantmentId: "efficiency",
                level: 5,
                price: 32,
                villagerId: "Granja Hierro",
                modifiedBy: "Admin",
              },
            ],
          },
        },
        {
          name: "Mundo Creativo", // Un segundo mundo de ejemplo
          enchantments: {
            create: [
              {
                enchantmentId: "sharpness",
                level: 5,
                price: 64,
                villagerId: "Aldeano VIP",
                modifiedBy: "Admin",
              },
            ],
          },
        },
      ],
    },
  },
  {
    username: "Invitado",
    password: "abc",
    // Este usuario no tiene mundos todavía
    worlds: {
      create: [],
    },
  },
];

export async function main() {
  console.log("🌱 Iniciando Seed...");

  for (const u of userData) {
    // Usamos upsert para no fallar si corres el seed 2 veces
    const user = await prisma.user.upsert({
      where: { username: u.username },
      update: {}, // Si existe, no hace nada
      create: u, // Si no existe, crea todo el árbol (User -> World -> Enchants)
    });
    console.log(`✅ Usuario procesado: ${user.username}`);
  }

  console.log("🌱 Seed terminada con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
