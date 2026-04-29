# Especificación producto y UX: Turnos Barbería/Peluquería

## Objetivo
Aplicación web/mobile para reservar, gestionar y cobrar turnos de peluquería/barbería. Dos superficies claras:
- **Cliente**: experiencia en 3–4 pasos, mobile-first.
- **Profesional/Administrador**: dashboard operativo con control total de agenda, servicios, clientes y métricas.

## Roles y accesos
- **Cliente**: registro/login (Google, email magic link, WhatsApp OTP), búsqueda/selección de local, profesional y servicio, reserva, reprogramación/cancelación según políticas.
- **Profesional**: gestiona su agenda, servicios y confirma/rechaza turnos.
- **Administrador**: configura locales, políticas, profesionales, precios, horarios y ve métricas agregadas.

## Experiencia Cliente (UX)
- **Flujo de reserva en 3–4 pasos**
  1) Seleccionar local (o usar ubicación para sugerir) y profesional opcional.
  2) Elegir servicio (precio, duración, combos, etiquetas tipo “fade”, “color”).
  3) Ver disponibilidad en tiempo real (slots generados por agenda + buffers) y elegir horario.
  4) Confirmar datos de contacto y método de recordatorio (push, email o WhatsApp). Opcional: pagar/dejar tarjeta.
- **Historial y gestión**: ver turnos con estados (confirmado, pendiente, cancelado), reprogramar o cancelar bajo la política vigente (ej. límite 12h). Añadir nota al turno.
- **Feedback claro**: estados con chips de color, toasts de éxito/error, skeletons y loaders cortos. Dark mode opcional.

## Experiencia Profesional / Administrador
- **Dashboard** (vista día/semana/mes) con drag & drop y filtros por profesional/servicio.
- **Agenda**: bloquear horarios, definir días laborales y buffers, aprobación manual u automática de turnos, reprogramar o cancelar avisando al cliente.
- **Servicios**: CRUD con nombre, precio, duración, buffer opcional, flag “destacado” y combos.
- **Clientes**: ficha con historial, notas internas (“prefiere fade”, “llega temprano”), tags, frecuencia y valor de vida.
- **Métricas**: turnos/día/mes, horas ocupadas vs disponibles, tasa de cancelación, top servicios, utilización por profesional.
- **Configuración negocio**: nombre del local, ubicaciones, redes, políticas de cancelación/no-show, múltiples profesionales por local, branding básico (logo/colores).

## Reglas de negocio clave
- Evitar solapamientos calculando disponibilidad con duración real + buffer; considerar zonas horarias y días especiales.
- Límite configurable para cancelar/reprogramar; posibilidad de cargos por no-show.
- Múltiples profesionales por local; vistas por recurso (silla) opcional.
- Slots generados solo dentro de horarios laborales y respetando bloqueos manuales.

## Tecnología sugerida
- **Frontend**: React + Next.js (SSR/ISR para catálogos), UI con Tailwind/Chakra + componentes accesibles, PWA para push. Alternativa móvil: Flutter si se busca app nativa.
- **Backend**: Node.js (NestJS/Express) o Django. Servicios: autenticación, agenda, pagos, notificaciones, reportes. Webhooks para pagos/WhatsApp.
- **Base de datos**: PostgreSQL (consistencia y consultas avanzadas), Redis para locks/colas de notificaciones y generación de slots.
- **Infra**: API REST/GraphQL, file storage (S3), despliegue en containers + CI/CD, feature flags. Autenticación segura (JWT + refresh, OAuth Google/Apple, magic link email; WhatsApp via provider).

## Modelo de datos (borrador)
- `users`: id, rol (cliente/profesional/admin), nombre, contacto, auth_provider.
- `locations`: id, nombre, dirección, timezone, redes, branding.
- `professionals`: id, user_id, location_id, bio, foto, capacidad de recursos.
- `services`: id, location_id, nombre, duración_min, precio, buffer_min, activo, tipo, combo_ref.
- `schedules`: professional_id, día_semana, hora_inicio/fin, excepciones (feriados), time_zone.
- `blocks`: professional_id, start_at, end_at, motivo (bloqueo manual, mantenimiento).
- `appointments`: id, location_id, professional_id, service_id, user_id, estado (pendiente, confirmado, cancelado, no-show), start_at, end_at, precio, notas_cliente, notas_internas, origen (web, app, walk-in).
- `notifications`: appointment_id, canal (push/email/whatsapp), estado.
- `payments` (opcional): appointment_id, status, método, amount, currency, fee.

## Flujos críticos
- **Reserva**: frontend solicita slots -> backend genera disponibilidad en base a horarios, buffers y bloques -> cliente elige -> backend coloca lock en Redis y confirma cita -> envía notificaciones.
- **Reprogramación/Cancelación**: validar ventana permitida, recalcular disponibilidad y liberar slot previo; disparar aviso al cliente/profesional.
- **No-show**: marcar cita, aplicar política (cargo o penalización), ajustar métricas.

## Notificaciones y recordatorios
- Push web/app (PWA o app nativa), email y WhatsApp. Programar secuencia (ej. 24h y 2h antes). Plantillas con nombre, servicio, profesional, política de cancelación y link para gestionar turno.

## Pagos y monetización (plus)
- Pagos online (Stripe/Mercado Pago) para señas o full pago; split de pagos a profesionales opcional.
- SaaS para locales: plan gratuito (agenda y recordatorios básicos) + planes pagos (reportes, marca blanca, multi-local, pagos, integraciones contables/CRM).

## Accesibilidad y seguridad
- Contraste alto, navegación con teclado, labels claros. Gestión de consentimientos (email/WhatsApp), almacenamiento seguro de tokens, cumplimiento GDPR/CCPA según mercado.

## Roadmap sugerido
1) MVP: reserva 3 pasos, agenda profesional, notificaciones email/push, políticas básicas.
2) Optimización: buffers inteligentes, métricas, notas internas, dark mode, PWA instalada.
3) Plus: pagos online, reseñas, multi-local, personalización de branding y planes SaaS.
