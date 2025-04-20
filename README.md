# Bizplan - Marketplace de Modelos de Negocio

Bienvenido a Bizplan, una plataforma web construida con Next.js y Firebase diseñada para que emprendedores y consultores puedan subir, compartir y vender sus modelos de negocio.

## Descripción

Bizplan ofrece un espacio donde los usuarios pueden explorar diferentes estrategias y estructuras de negocio, así como monetizar sus propias plantillas y modelos probados. Utilizamos Next.js para un rendimiento óptimo y una experiencia de usuario fluida, y Firebase para la autenticación, base de datos en tiempo real y almacenamiento de archivos.

## Características Principales (Ejemplo)

* **Autenticación de Usuarios:** Registro e inicio de sesión seguros utilizando Firebase Authentication.
* **Subida de Modelos:** Interfaz para que los usuarios suban sus modelos de negocio (posiblemente en formatos como PDF, DOCX, etc.).
* **Marketplace:** Visualización de los modelos de negocio disponibles para la venta.
* **Gestión de Archivos:** Almacenamiento seguro de los archivos subidos usando Firebase Storage.
* **Base de Datos:** Gestión de información de usuarios, modelos y transacciones con Firestore.
* **(Opcional) Pasarela de Pago:** Integración para procesar las compras de modelos (ej. Stripe, PayPal).

## Tecnologías Utilizadas

* **Frontend:** Next.js (React)
* **Backend & Base de Datos:** Firebase (Authentication, Firestore, Storage)
* **Estilos:** (Especifica aquí si usas Tailwind CSS, CSS Modules, Styled Components, etc.)
* **Gestor de Paquetes:** npm o yarn

## Prerrequisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

* Node.js (Se recomienda versión LTS)
* npm o yarn
* Git

## Configuración del Proyecto

Sigue estos pasos para tener una copia del proyecto corriendo en tu máquina local.

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/solrampulla/bizplan.git](https://github.com/solrampulla/bizplan.git) # URL actualizada implícitamente
    cd bizplan  # <--- CAMBIO IMPORTANTE AQUÍ
    ```
    *(La URL del clone ya usa 'bizplan' porque es la del repositorio. El cambio clave es el directorio al que entras)*

2.  **Instala las dependencias:**
    Usando npm:
    ```bash
    npm install
    ```
    O usando yarn:
    ```bash
    yarn install
    ```

3.  **Configura las variables de entorno:**
    Firebase requiere claves de configuración para conectarse a tu proyecto.
    * Crea un archivo llamado `.env.local` en la raíz del proyecto.
    * Añade las siguientes variables con tus credenciales de Firebase. Puedes encontrarlas en la configuración de tu proyecto en la consola de Firebase (Configuración del proyecto > General > Tus apps > Configuración SDK).

    ```plaintext
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=TU_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=TU_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=TU_APP_ID
    # Opcional: Measurement ID para Google Analytics
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=TU_MEASUREMENT_ID

    # Otras variables de entorno que necesites (ej. claves de API de pasarelas de pago)
    # STRIPE_SECRET_KEY=TU_CLAVE_SECRETA_STRIPE
    ```
    **Importante:** Asegúrate de que este archivo `.env.local` esté incluido en tu `.gitignore` para no exponer tus credenciales.

## Correr el Proyecto en Local

Una vez configurado, puedes iniciar el servidor de desarrollo:

Usando npm:
```bash
npm run dev