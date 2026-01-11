# 🏗️ Checklist de Arquitectura del Proyecto

## 📂 1. Configuración Base & Tipos
- [ ✅ ] **`src/types/index.ts`**
  - [ ✅ ] Definir `SafeUser` (User sin password).
  - [ ✅ ] Definir `WorldWithMembers` (con include).
  - [ ✅ ] Definir `UIEnchantment` (con campos visuales extra).
- [ ✅ ] **`src/lib/`**
  - [ ✅ ] `prisma.ts` (Cliente de DB con Singleton).
  - [ ✅ ] `auth.ts` (Manejo de cookies/tokens de sesión).
  - [ ✅ ] `constants.ts` (Datos estáticos de Minecraft, precios base).
- [ ✅ ] **`src/utils/`**
  - [ ✅ ] `api-client.ts` (Wrapper de fetch tipado).
  - [ ✅ ] `formatters.ts` (Helpers para fechas y monedas).
  - [ ✅ ] `validations.ts` (Regex para emails, longitud de passwords).
- [ ✅ ] **`src/app/globals.css`**
  - [ ✅ ] Definir variables CSS (colores Minecraft, modo oscuro).

## 🧩 2. Componentes UI (Design System)
*Componentes genéricos y reusables.*
- [ ✅ ] **`src/components/ui/Button/`**
  - [ ✅ ] `index.tsx` (Variantes: primary, secondary, danger).
  - [ ✅ ] `Button.module.css`.
- [ ✅ ] **`src/components/ui/Input/`**
  - [ ✅ ] `index.tsx` (Label, error message, input field).
  - [ ✅ ] `Input.module.css`.
- [ ✅ ] **`src/components/ui/Card/`**
  - [ ✅ ] `index.tsx` (Contenedor con bordes/sombras).
- [ ✅ ] **`src/components/ui/Modal/`**
  - [ ✅ ] `index.tsx` (Overlay y ventana emergente).
- [ ✅ ] **`src/components/ui/Spinner/`**
  - [ ✅ ] `index.tsx` (Loader animado).
- [ ✅ ] **`src/components/ui/Badge/`**
  - [ ✅ ] `index.tsx` (Pill de estado).

## 🚀 3. Componentes de Negocio (Features)
*Lógica específica de la aplicación.*
- [ ✅ ] **`src/components/layout/`**
  - [ ✅ ] `Navbar.tsx` (Logo, User Avatar, Logout).
  - [ ✅ ] `Footer.tsx` (Créditos).
- [ ✅ ] **`src/components/features/auth/`**
  - [ ✅ ] `LoginForm.tsx` (Usa `api-client` para loguear).
  - [ ✅ ] `RegisterForm.tsx` (Crear cuenta nueva).
- [ ✅ ] **`src/components/features/world-select/`**
  - [ ✅ ] `WorldList.tsx` (Grid de tarjetas de mundos).
  - [ ✅ ] `CreateWorldModal.tsx` (Formulario para nuevo mundo).
- [ ✅ ] **`src/components/features/tracker/`**
  - [ ✅ ] `QuickCheck.tsx` (Resumen de estado).
  - [ ✅ ] `Filter.tsx` (Buscador y selectores).
  - [ ✅ ] `EnchantmentTable.tsx` (Tabla principal interactiva).

## 🔌 4. API (Backend Routes)
- [ ✅ ] **`src/app/api/auth/`**
  - [ ✅ ] `login/route.ts` (Validar credenciales, devolver user).
  - [ ✅ ] `register/route.ts` (Crear User en DB).
  - [ ✅ ] `me/route.ts` (Verificar sesión al recargar página).
  - [ ✅ ] `logout/route.ts` (Borrar cookie de sesión).
- [ ✅ ] **`src/app/api/worlds/`**
  - [ ✅ ] `route.ts` (GET: Listar mundos del user | POST: Crear mundo).
  - [ ✅ ] `[id]/route.ts` (DELETE: Borrar mundo | PUT: Renombrar).
- [ ✅ ] **`src/app/api/world/[id]/items/`**
  - [ ✅ ] `route.ts` (GET: Traer encantamientos | POST: Actualizar/Upsert).

## 📱 5. Páginas (Frontend Routes)
- [ ] **`src/app/layout.tsx`** (Root Layout con fuentes y metadata).
- [ ] **Rutas Públicas `(auth)`**
  - [ ] `src/app/(auth)/login/page.tsx` (Renderiza `LoginForm`).
  - [ ] `src/app/(auth)/register/page.tsx` (Renderiza `RegisterForm`).
- [ ] **Rutas Privadas `(dashboard)`**
  - [ ] `src/app/(dashboard)/layout.tsx` (Incluye el `Navbar` checkeando sesión).
  - [ ] `src/app/(dashboard)/worlds/page.tsx` (Renderiza `WorldList`).
  - [ ] `src/app/(dashboard)/world/[id]/page.tsx` (El Tracker principal).

## 🪝 6. Hooks
- [ ✅ ] **`src/hooks/use-auth.ts`** (Contexto o hook para leer el usuario actual).
- [ ✅ ] **`src/hooks/use-world-data.ts`** (SWR o Fetch para mantener la tabla actualizada).