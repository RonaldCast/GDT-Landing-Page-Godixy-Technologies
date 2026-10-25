# Índice del paquete de entrega — Landing Godixy Technologies

| Campo | Valor |
| --- | --- |
| Fase / puerta | F9 / G9 (cierre) |
| Nivel GDF | Lite (el formulario de contacto se trata con rigor Standard) |
| Autora | Ana Paredes (Documentación y soporte) |
| Aprobador | Ronald Castillo |
| Fecha | 25 de octubre de 2026 |
| Estado | Borrador editorial. **G7, G8 y G9 no están aprobados.** |

Este paquete describe el sitio **tal como está en el repositorio**. No autoriza publicación, no define un SLA y no sustituye la revisión legal del aviso de privacidad.

Sitio previsto: [https://godixy.com](https://godixy.com).

## Inventario

| Documento | Público | Contenido |
| --- | --- | --- |
| [guia-del-sitio.md](guia-del-sitio.md) | Operación Godixy (uso del sitio publicado) | Navegar secciones, cambiar idioma, enviar una solicitud, aviso de privacidad |
| [editar-contenido.md](editar-contenido.md) | Quien actualiza textos EN/ES | Dónde está cada texto y cómo comprobar paridad |
| [soporte.md](soporte.md) | Quien atiende fallos del sitio o del formulario | Fallos del formulario, SMTP, comprobación de salud. Sin plazos inventados |
| [../../README.md](../../README.md) | Ingeniería | Arquitectura, scripts, i18n, Action y tokens (inglés) |
| [../05-release/deploy-runbook.md](../05-release/deploy-runbook.md) | Despliegue (Paula Castillo) | Imagen Docker, variables (solo nombres), healthcheck y rollback |

## Documentos GDF de contexto (no forman parte de este paquete operativo)

| Ruta | Uso |
| --- | --- |
| [../00-commercial/project-brief.md](../00-commercial/project-brief.md) | Alcance y nivel Lite |
| [../01-discovery/requirements.md](../01-discovery/requirements.md) | Requisitos y criterios de aceptación |
| [../02-planning/handoff-ledger.md](../02-planning/handoff-ledger.md) | Estado de puertas y dueños |
| [../03-design/architecture.md](../03-design/architecture.md) | Arquitectura y ADRs |
| [../03-design/ux-ui.md](../03-design/ux-ui.md) | Diseño (borrador) |
| [../04-quality/qa-report.md](../04-quality/qa-report.md) | Evidencia de QA; G7 pendiente de firma |
| [../04-quality/security-review.md](../04-quality/security-review.md) | Revisión de Nicolás Vega; G7/G8 no aprobados |

The privacy-notice text still needs legal review before publication.

## Qué entrega este cierre ( Lite )

- Guía de uso alineada con las cadenas reales de `src/shared/i18n/es.ts` y las páginas.
- Guía de edición de diccionarios (sin CMS).
- Procedimiento de soporte sin tiempos de respuesta, garantías ni precios.
- Puntero al README técnico y al runbook de despliegue.

## Qué no entrega

- Aprobación de G7, G8 o G9.
- URL de producción distinta de `https://godixy.com`.
- Credenciales SMTP o de Coolify.
- SLA, garantía, precios o compromiso de “responder en X días”.
- Manual de clic a clic de Coolify más allá de lo que ya escribió Paula.

## Revisión editorial pendiente (no es aprobación de puerta)

| Especialista | Qué debe verificar |
| --- | --- |
| Gabriel Núñez | Exactitud de arquitectura e i18n en el README |
| Paula Castillo | Que soporte y README no contradigan el runbook (puerto 4321, `/api/health`, nombres de env) |
| Isabel Medina | Que la guía del sitio coincida con la UI aceptada en pruebas |
| Nicolás Vega | Que el procedimiento de soporte no filtre secretos ni describa abusos explotables |
| Ronald Castillo | Firma G9: entrega formal y dueño operativo |

**Siguiente dueño:** Ronald Castillo (decisión G9).
