src/
├── app/                          # RUTAS Y PÁGINAS (App Router)
│   ├── api/                      # --- BACKEND (API Routes) ---
│   │   ├── auth/                 # Login y Registro
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── worlds/               # Gestión de Mundos
│   │   │   ├── route.ts          # GET (Listar mundos), POST (Crear)
│   │   │   └── [id]/route.ts     # DELETE (Borrar mundo), PUT (Editar)
│   │   └── world/                # Lógica interna del mundo
│   │       └── [id]/             # ID del mundo
│   │           └── items/route.ts # GET/POST encantamientos de este mundo
│   │
│   ├── (auth)/                   # --- GRUPO PÚBLICO (Sin Navbar) ---
│   │   ├── login/page.tsx        # Formulario de Login
│   │   └── register/page.tsx     # Formulario de Registro
│   │
│   ├── (dashboard)/              # --- GRUPO PRIVADO (Con Layout) ---
│   │   ├── layout.tsx            # <Navbar> con info del usuario
│   │   ├── worlds/               # "Mis Mundos"
│   │   │   └── page.tsx          # Grid de tarjetas de mundos
│   │   └── world/                # Vista del Tracker
│   │       └── [id]/             # Ruta dinámica (ej: /world/cm5s...)
│   │           └── page.tsx      # <QuickCheck> y <EnchantmentTable>
│   │
│   ├── globals.css               # Estilos globales / Variables CSS
│   └── layout.tsx                # Root Layout (Fuentes, Providers)
│
├── components/                   # COMPONENTES DE REACT
│   ├── ui/                       # ---> TUS COMPONENTES GENÉRICOS <---
│   │   ├── Button/               # Botones reusables
│   │   ├── Input/                # Inputs de texto controlados
│   │   ├── Card/                 # Contenedores con sombra/borde
│   │   ├── Modal/                # Ventanas emergentes
│   │   ├── Spinner/              # Indicador de carga
│   │   └── Badge/                # Etiquetas (ej: "Nivel Max")
│   │
│   ├── features/                 # ---> COMPONENTES DE NEGOCIO <---
│   │   ├── auth/                 # LoginForm, RegisterForm
│   │   ├── world-select/         # WorldList, CreateWorldModal
│   │   └── tracker/              # EnchantmentTable, QuickCheck, Filter
│   │
│   └── layout/                   # Navbar, Sidebar, Footer
│
├── lib/                          # LIBRERÍAS Y CONFIGURACIÓN
│   ├── prisma.ts                 # Instancia única de la DB (Neon)
│   ├── auth.ts                   # Helpers de sesión (cookies/tokens)
│   └── constants.ts              # Constantes (ej: LISTA_ENCANTAMIENTOS)
│
├── utils/                        # UTILIDADES PURAS (Funciones)
│   ├── api-client.ts             # Wrapper para fetch (manejo de errores)
│   ├── formatters.ts             # Formatear dinero, fechas
│   └── validations.ts            # Validar emails, contraseñas
│
├── hooks/                        # CUSTOM HOOKS
│   ├── use-auth.ts               # Hook para saber si estoy logueado
│   └── use-world-data.ts         # Hook para cargar datos del tracker
│
└── types/                        # DEFINICIONES DE TYPESCRIPT
    └── index.ts                  # Interfaces User, World, Enchantment