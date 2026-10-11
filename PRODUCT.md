# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Duenos y encargados de panaderias pequenas (Bolivia y LatAm). Trabajan con Excels de ventas y compras hechos a mano o por su sistema de caja; no usan contabilidad profesional. Situacion real: cierran el dia/semana con planillas y quieren saber cuanto ganaron, que se vendio y que reponer, sin aprender software contable. El job: subir sus Excels y obtener metricas + un analisis claro que les diga que hacer.

## Product Purpose

InventarioSIS es un SaaS de gestion financiera y de inventario para panaderias. Sube Excels de ventas y compras, los carga a una planilla de Google Sheets propia del cliente, y devuelve dashboard con metricas (ingresos, costos, ganancia, margen, top productos, stock bajo) e informes de IA. Existe porque una panaderia no necesita un ERP: necesita entender sus numeros en minutos. Exito = el dueno abre el dashboard y responde "cuanto gane y que me falta reponer" sin ayuda.

## Positioning

La data vive en el Google Sheets DEL CLIENTE, no en una base de datos nuestra. El cliente es dueno, ve, edita y se lleva sus datos cuando quiere; nosotros solo leemos/escribimos via service account compartida. Sin DB = costos operativos casi cero, lo que permite el precio de venta ($100-200 alta + $15/mes). Ningun competidor con dashboard bonito te da la planilla abierta.

## Operating Context

- Login por licencia (clave unica por cliente, sin registro ni passwords). Sin base de datos.
- El cliente crea su spreadsheet (copia de plantilla), lo comparte con la service account, pega la URL en la app.
- Subida de Excels en formato libre (no hay plantilla estandar); el mapeo de columnas lo propone IA y el cliente confirma.
- Mercado con doble moneda: USD y Bs (boliviano). La tasa de cambio la define/configura el cliente.
- Soporte = el cliente comparte su hoja con el email del dueno del producto (sharing nativo de Google).
- MVP vendido manualmente; activacion de clientes via variable de entorno (lista de licencias).

## Capabilities and Constraints

- Subir Excel/CSV → parseo SheetJS → mapeo de columnas asistido por IA (OpenRouter) → confirmacion del cliente → escritura a su Google Sheet.
- Pestañas del sheet del cliente: ventas, compras, inventario, analisis_IA, config.
- Dashboard server-side con KPIs leidos de Sheets: ingresos, costos, ganancia neta, margen %, comparativa vs periodo anterior, top productos, alertas de stock bajo.
- Informe de IA en lenguaje natural (OpenRouter, modelo barato) guardado en la pestaña analisis_IA con historial.
- Doble moneda USD/Bs con tasa configurable.
- Login por licencia; sin base de datos en ninguna parte (sesion JWT en cookie).
- Stack: Next.js 16 (App Router, Turbopack) en Vercel, TypeScript, Tailwind, googleapis (service account), SheetJS, Recharts, OpenRouter.
- Restriccion dura: cero bases de datos, cero costos fijos de infraestructura para sostener el precio.
- Abierto/decidido despues: verificacion de app de Google cuando se escale mas alla del modo Testing; pasarela de pagos cuando haya volumen.

## Brand Commitments

- Nombre: InventarioSIS.
- Interfaz en espanol neutro.
- Restriccion visual vinculante del dueno: modo claro con colores pasteles (tematica panaderia), modo oscuro, animaciones suaves acordes al sistema.
- Moneda: USD y Bs (boliviano) con manejo de tasas.

## Evidence on Hand

Ningun activo de marca todavia (sin logo, sin clientes reales, sin testimoniales). Service account creada en Google Cloud (proyecto gen-lang-client-0970937186). No fabricar clientes, numeros o testimonios en ninguna superficie.

## Product Principles

1. El cliente es dueno de sus datos: viven en su Google Sheet, siempre visibles y exportables.
2. Simplicidad antes que potencia: cada flujo menos pasos que una planilla bien hecha a mano.
3. La IA explica y aconseja, no decide: informes accionables para panaderos, no jerga contable.
4. Costo operativo minimo es parte del producto: sostiene el precio y la promesa de simplicidad.
5. Cero friccion de onboarding: licencia + URL de hoja = adentro.
