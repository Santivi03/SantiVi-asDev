---
version: alpha
name: Santi Viñas Portfolio
description: Portfolio de desarrollador full stack freelance. Mundo de telemetría espacial contenido, al servicio de la confianza.
colors:
  primary: "#3DAEFF"
  on-primary: "#041320"
  primary-hover: "#6CC1FF"
  space: "#07090D"
  surface: "#0C1016"
  surface-raised: "#121822"
  line: "#1E2733"
  line-strong: "#2C3846"
  ink: "#EDF1F7"
  ink-muted: "#A3AEBD"
  ink-faint: "#7D8898"
  status: "#3DDC97"
typography:
  display:
    fontFamily: Chakra Petch
    fontSize: 68px
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: -0.03em
  headline:
    fontFamily: Chakra Petch
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.02em
  title:
    fontFamily: Chakra Petch
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.2
  data:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.01em
rounded:
  sm: 6px
  md: 12px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  section: 128px
  gutter: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 14px 22px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "{colors.space}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 14px 22px
  button-secondary-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
  media-frame:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
  stack-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: 4px 10px
  text-link:
    backgroundColor: "{colors.space}"
    textColor: "{colors.primary}"
  status-dot:
    backgroundColor: "{colors.status}"
    rounded: "{rounded.full}"
    size: 8px
  divider:
    backgroundColor: "{colors.line}"
    height: 1px
  hud-corner:
    backgroundColor: "{colors.line-strong}"
    size: 14px
  data-caption:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-faint}"
    typography: "{typography.data}"
---

# Santi Viñas Portfolio

## Overview

Portfolio personal de un desarrollador full stack freelance de Buenos Aires. Le habla a emprendedores y pymes que buscan quien les haga una web, una app o una automatización, y a quienes reclutan. La palabra que manda es **confianza**: todo lo que se ve tiene que poder comprobarse (sitio en vivo, código público, fechas reales).

El mundo visual es telemetría espacial contenida: fondo de espacio profundo con estrellas finas que derivan despacio, líneas de 1px, esquinas de encuadre tipo HUD alrededor de las capturas y datos técnicos en monoespaciada. Lo futurista está en los detalles, nunca por encima del contenido. Sin glow, sin vidrio, sin neón.

## Colors

Un solo acento sobre neutros fríos casi negros.

- **Primary (#3DAEFF):** azul señal. Solo para la acción principal, los enlaces y el indicador de sección activa.
- **Space (#07090D):** fondo de la página.
- **Surface (#0C1016) y Surface raised (#121822):** marcos de capturas y estados hover.
- **Line (#1E2733) y Line strong (#2C3846):** divisores y bordes de 1px, esquinas de encuadre.
- **Ink (#EDF1F7):** titulares y texto principal.
- **Ink muted (#A3AEBD):** párrafos secundarios y metadatos.
- **Ink faint (#7D8898):** solo texto de datos pequeño y decorativo, nunca párrafos.
- **Status (#3DDC97):** el punto de "disponible". No se usa para nada más.

## Typography

- **Chakra Petch** (display, headline, title): angular y técnica, da el tono futurista sin caer en mayúsculas espaciadas. Siempre en caja normal.
- **IBM Plex Sans** (body, label): lectura cómoda para un público no técnico.
- **IBM Plex Mono** (data): solo para datos reales: stack, URLs, fechas, estados. Nunca como disfraz de "tecnológico" en titulares o párrafos.

La medida del texto corrido se queda entre 60 y 70 caracteres.

## Layout

Contenedor de 1200px con margen lateral fluido (16px en móvil, hasta 40px). Composición asimétrica alineada a la izquierda: el hero en dos columnas (texto y captura enmarcada), el proyecto principal a ancho completo y los secundarios en dos columnas. Servicios como lista con divisores, no como tarjetas. Separación entre secciones de 128px en escritorio y 88px en móvil.

Orden: Hero, Proyectos, Servicios, Sobre mí, Contacto.

## Elevation & Depth

Sin sombras. La profundidad sale del fondo de estrellas (capa lejana) y de los marcos de 1px con esquinas de encuadre (capa cercana). Un elemento se eleva cambiando su superficie a Surface raised, no con halos de color.

## Shapes

Radio de 6px en botones y etiquetas, 12px en marcos de capturas. Las esquinas de encuadre HUD son segmentos de 14px en L, en Line strong, que pasan a Primary en hover.

## Components

- **Botón principal:** fondo Primary, texto On primary, radio 6px.
- **Botón secundario:** borde Line strong sobre Space, hover a Surface raised.
- **Marco de captura:** superficie Surface, borde Line, esquinas HUD y una barra inferior con la URL en monoespaciada.
- **Etiqueta de stack:** monoespaciada 13px, borde Line, texto Ink muted.
- **Enlace de texto:** Primary con subrayado desplazado 4px y flecha SVG.
- **Punto de estado:** círculo Status de 8px junto a la disponibilidad.

## Do's and Don'ts

- Do: enlazar cada proyecto a su sitio en vivo y a su código cuando existan.
- Do: usar la monoespaciada solo para datos que el lector puede verificar.
- Do: respetar `prefers-reduced-motion` (las estrellas quedan quietas y el encuadre del hero aparece sin animación).
- Don't: glow de colores, texto con degradado, paneles de vidrio ni emojis como iconos.
- Don't: etiquetas encima de los titulares ni numeración de secciones.
- Don't: inventar cifras, clientes, testimonios o fechas.
