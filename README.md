# InventarioSIS

Sistema de gestion de inventario y finanzas para panaderias. El cliente sube sus
Excels de ventas y compras; el sistema los carga a **NeonDB (PostgreSQL)** y le
devuelve metricas (ingresos, costos, ganancia, margen, top productos, stock bajo)
mas un analisis con IA en lenguaje claro.

**Login por licencia.** Sin registro ni passwords. La sesion dura 24 horas.

## Como se usa (cliente)

1. Recibe una clave de licencia (`INV-XXXX-XXXX`) al comprar.
2. Entra al sitio, pega la clave.
3. Sube sus Excels (ventas / compras / inventario). Una IA propone el mapeo de
   columnas; el confirma y las filas se cargan a la base de datos.
4. El dashboard muestra las metricas; "Analisis IA" genera el informe del mes.

Tambien puede tocar **"Explorar con datos de demostracion"** sin cargar nada.

## Setup (administrador)

```bash
npm install
cp .env.example .env.local   # o .env
```

Completá el `.env`:

| Variable | Que es |
|---|---|
| `DATABASE_URL` | Connection string de NeonDB (neon.tech → tu proyecto → Connection Details) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `LICENSE_KEYS` | Claves activas, separadas por coma. Genera una: `node scripts/gen-license.mjs` |
| `OPENROUTER_API_KEY` | Clave de openrouter.ai |
| `OPENROUTER_MODEL` | Default: `openrouter/auto` |

Inicializar las tablas:

```bash
node scripts/init-db.mjs
```

```bash
npm run dev
```

## Seguridad

- **Brute force**: maximo 3 intentos fallidos por licencia cada 15 minutos.
- **Sesion**: cookie httpOnly firmada HMAC, expira en 24 horas.
- **SQL injection**: queries parameterized via Neon tagged templates.
- **Timing-safe**: comparacion de licencias resistente a timing attacks.

## Deploy (Vercel)

- Importa el repo a Vercel.
- Copia las variables de `.env` a Project Settings → Environment Variables.
- Deploy.

## Scripts utiles

```bash
node scripts/gen-license.mjs   # genera una clave nueva de cliente
node scripts/init-db.mjs       # crea las tablas en NeonDB
```

## Estructura

```
src/
├── app/
│   ├── page.tsx                  # login por licencia
│   ├── (app)/                    # areas protegidas (proxy.ts)
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── analisis/
│   │   ├── inventario/
│   │   └── configuracion/
│   └── api/                      # auth, config, upload, analyze
├── components/                   # shell, kpis, curva, wizard
├── lib/                          # session, license, db, kpis, openrouter, excel
└── proxy.ts                      # proteccion de rutas
```

## Moneda

Trabaja con **Bs (bolivianos) y USD**. La tasa se configura en Configuracion
(clave `tasa_usd_bs` en la tabla `app_config`).
