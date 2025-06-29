# Shark Market - Marketplace de Modelos de Negocio

Bienvenido a Bizplan, una plataforma web construida con Next.js y **Supabase** diseñada para que emprendedores y consultores puedan subir, compartir y vender sus modelos de negocio.

## Descripción

Bizplan ofrece un espacio donde los usuarios pueden explorar diferentes estrategias y estructuras de negocio, así como monetizar sus propias plantillas y modelos probados. Utilizamos Next.js para un rendimiento óptimo y una experiencia de usuario fluida, y **Supabase** para la autenticación, base de datos PostgreSQL en tiempo real y almacenamiento de archivos.

## Características Principales (Ejemplo)

* **Autenticación de Usuarios:** Registro e inicio de sesión seguros utilizando **Supabase Auth**.
* **Subida de Modelos:** Interfaz para que los usuarios suban sus modelos de negocio (posiblemente en formatos como PDF, DOCX, etc.).
* **Marketplace:** Visualización de los modelos de negocio disponibles para la venta.
* **Gestión de Archivos:** Almacenamiento seguro de los archivos subidos usando **Supabase Storage**.
* **Base de Datos:** Gestión de información de usuarios, modelos y transacciones con **Supabase Database (PostgreSQL)**.
* **(Opcional) Pasarela de Pago:** Integración para procesar las compras de modelos (ej. Stripe, PayPal).

## Tecnologías Utilizadas

* **Frontend:** Next.js (React)
* **Backend & Base de Datos:** **Supabase** (Auth, Database, Storage)
* **Estilos:** (Especifica aquí si usas Tailwind CSS, CSS Modules, Styled Components, etc.)
* **Gestor de Paquetes:** npm o yarn

## Prerrequisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

* Node.js (Se recomienda versión LTS)
* npm o yarn
* Git
* Una cuenta de Supabase ([supabase.com](https://supabase.com/))

## Configuración del Proyecto

Sigue estos pasos para tener una copia del proyecto corriendo en tu máquina local.

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/solrampulla/bizplan.git](https://github.com/solrampulla/bizplan.git)
    cd bizplan
    ```

2.  **Instala las dependencias:**
    Usando npm:
    ```bash
    npm install
    ```
    O usando yarn:
    ```bash
    yarn install
    ```
    *(Asegúrate de haber corrido `npm install @supabase/supabase-js` como te indiqué antes)*

3.  **Configura las variables de entorno:**
    **Supabase** requiere una URL y una clave anónima pública para conectarse a tu proyecto.
    * Crea un archivo llamado `.env.local` en la raíz del proyecto (si no existe).
    * Añade las siguientes variables con tus credenciales de Supabase. Puedes encontrarlas en la configuración de tu proyecto en el dashboard de Supabase (Settings > API).

    ```plaintext
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
    ```
    **Importante:** Asegúrate de que este archivo `.env.local` esté incluido en tu `.gitignore` para no exponer tus credenciales (aunque la clave 'anon' es pública, la URL es específica de tu proyecto).

## Correr el Proyecto en Local

Una vez configurado, puedes iniciar el servidor de desarrollo:

Usando npm:
```bash
npm run dev
