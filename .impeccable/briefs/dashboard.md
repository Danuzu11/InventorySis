# Surface brief — App shell + Dashboard (primer viewport)

## Scope & mode

Operate. App operativa para dueños de panadería: dashboard diario/semanal con KPIs, curva de ingresos, top productos y alertas de stock. Primer surface del producto: `src/app/(app)/dashboard/page.tsx` + app shell compartida.

## Audience & job

Dueño de panadería (no técnico, español, Bolivia/LatAm). Job: abrir el sistema y responder en segundos «cuánto gané, qué se vendió, qué reponer». Frecuencia: diaria al cierre + semanal.

## Action / task / proof / constraints

- Acción primaria: leer estado del negocio. Secundaria: subir Excel, pedir análisis IA.
- Proof: datos reales de ejemplo (Panadería La Espiga, octubre, Bs/USD con tasa 6,92) — sintéticos, etiquetables como demo.
- Constraints: sin DB; Google Sheets del cliente como fuente; USD + Bs; pastel en claro, oscuro cálido, animaciones suaves; español neutro.

## Direction contract

### THESIS

El negocio se lee como una producción panadería: cada KPI es una etapa con su tiempo, y toda serie temporal es una curva que sube como masa. Se niega el dashboard SaaS genérico (gris claro, azul corporativo, tarjetas intercambiables).

### OWN-WORLD

Claro: suelo masa cruda `#F6EFE3`, tarjetas `#FFFDF8` con borde `#E8DCC8` y radio 18px, tinta cacao `#4A3B32`, etiquetas mono `#8A7566`. Roles de etapa: rosa fermentado `#F2C9C2` (ventas/ingresos), pistacho `#C9D9C5` (ganancia/bien), melaza `#E8D4C0` (costos), ámbar horno `#E8A87C` — único color saturado, reservado a acciones y foco. Oscuro: suelo horno de noche `#241F1C`, tarjetas `#2E2823`, bordes `#3D362F`, mismo ámbar de acción, pastel a claridad elevada. Tipografía: Nunito (humanista redonda) para todo el UI; IBM Plex Mono para micro-etiquetas en mayúscula con tracking. Cifras KPI a escala monumental con tabular-nums. Firma: curvas de área pastel (gradiente rosa masa → suelo) con stroke ámbar y punto vivo al cero de hoy; pills de etapa de jornada (hecha / ahora / próxima).

### STORY

Entra, ve la jornada en etapas, lee ingresos/costos/ganancia/margen (Bs ≈ USD), mira la curva que sube, identifica el producto top y la alerta de stock con la acción clara. Sale sabiendo qué hacer.

### FIRST VIEWPORT

1440×900: topbar (marca InventarioSIS + nav Dashboard/Subir Excel/Análisis IA/Inventario/Configuración + usuario); stage rail «Jornada de hoy» con pills Amasado›Horneado›Vendido·42 pedidos›Cierre 19:00; H1 «Tu negocio, en etapas»; fila de 4 KPIs (Ingresos Bs 48.320 ≈ USD 6.980 ▲12% / Costos Bs 31.150 / Ganancia Bs 17.170 / Margen 35,5% ▲2,1 pts); grilla 1.55fr|1fr con curva «Curva de fermentación — ingresos de 30 días» y tarjeta «Lo que más sale» (4 productos + alerta Harina 0000 12 kg). Acción saturada únicamente donde se puede actuar.

### FORM

Dirección asignada Masa Viva (seed key 0986a88e), hand de 6/10/2026. Code-led: el contrato FIRST VIEWPORT y la firma de curva son la ambición; sin comps de imagen.

### FINISH

unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Memorable moment

La curva de fermentación que sube con relleno pastel rosa y el punto ámbar vivo al final — el negocio creciendo a la vista.

## Unresolved

- Plantilla Google Sheet real del cliente (se genera vía API en Etapa sheets).
- Copy de empty states y errores (se definen en harden).
