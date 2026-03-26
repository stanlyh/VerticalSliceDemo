## Vertical Slice Demo — .NET 10 + Angular 21

Proyecto full-stack de demostración que implementa la arquitectura **Vertical Slice** de extremo a extremo: API REST en .NET 10 y frontend en Angular 21 con Tailwind CSS v4. Cada funcionalidad (feature) está autocontenida en su propia carpeta tanto en el backend como en el frontend.

---

### Tecnologías

**Backend**
- .NET 10 / C# — ASP.NET Core Web API
- ADO.NET puro (`Microsoft.Data.SqlClient`) — sin ORM
- SQL Server
- OpenAPI para documentación de endpoints

**Frontend**
- Angular 21 — componentes standalone, sin NgModules
- Tailwind CSS v4 — sin librerías de componentes UI
- Signals nativos de Angular para estado (`signal`, `computed`) — sin NgRx
- Lazy loading por feature slice
- Reactive Forms con validadores custom

---

### Estructura del proyecto

```
VerticalSliceDemo/
├── ContextDB/
│   └── ConnectionDB.cs              # Wrapper de conexión a SQL Server
├── Features/                        # Vertical slices del backend
│   ├── Products/
│   │   ├── CreateProduct.cs         # POST   /api/product/new
│   │   ├── GetAllProduct.cs         # GET    /api/product/getAll
│   │   ├── EditProduct.cs           # PUT    /api/product/edit
│   │   └── DeleteProduct.cs         # DELETE /api/product/delete
│   ├── Clients/
│   │   ├── CreateClient.cs          # POST   /api/client/new
│   │   ├── GetAllClient.cs          # GET    /api/client/getAll
│   │   ├── EditClient.cs            # PUT    /api/client/edit
│   │   └── DeleteClient.cs          # DELETE /api/client/delete
│   └── Providers/
│       ├── CreateProvider.cs        # POST   /api/provider/new
│       ├── GetAllProvider.cs        # GET    /api/provider/getAll
│       ├── EditProvider.cs          # PUT    /api/provider/edit
│       └── DeleteProvider.cs        # DELETE /api/provider/delete
├── Program.cs
├── appsettings.json
├── VerticalSliceDemo.csproj
│
└── vertical-slice-ui/               # Frontend Angular 21
    └── src/app/
        ├── core/                    # Interceptores y servicios globales
        │   ├── interceptors/        # base-url, error-handler
        │   └── services/            # toast.service (signals)
        ├── shared/                  # Componentes y validadores reutilizables
        │   ├── components/          # data-table, modal, confirm-dialog,
        │   │                        # form-field, table-skeleton, toast,
        │   │                        # spinner, page-header, sidebar
        │   └── validators/          # positiveNumber(), phoneFormat()
        ├── features/                # Vertical slices del frontend
        │   ├── products/            # model + service + state + form + list
        │   ├── clients/             # model + service + state + form + list
        │   └── providers/           # model + service + state + form + list
        └── layout/                  # Shell: sidebar + router-outlet
```

---

### Arquitectura Vertical Slice

El patrón se aplica en ambas capas. Cada feature es autocontenida de extremo a extremo.

**Backend** — cada archivo en `Features/` agrupa:
```
CreateProduct.cs
├── CreateProductCommand    (record)  → define la entrada
├── CreateProductHandler    (class)   → lógica de negocio y acceso a datos
└── CreateProductController (class)   → endpoint HTTP
```

**Frontend** — cada carpeta en `features/` agrupa:
```
features/products/
├── models/product.model.ts   → interfaces TypeScript
├── products.service.ts       → llamadas HTTP
├── products.state.ts         → estado con Signals
├── product-form/             → formulario reactivo (crear/editar)
└── products-list/            → tabla + modal + confirm dialog
```

Esto permite agregar, modificar o eliminar un dominio completo sin afectar los demás.

---

### Endpoints

#### Products

| Método   | Ruta                    | Body / Params                         |
|----------|-------------------------|---------------------------------------|
| `POST`   | `/api/product/new`      | `{ name, price }`                     |
| `GET`    | `/api/product/getAll`   | —                                     |
| `PUT`    | `/api/product/edit`     | `{ idProduct, name, price }`          |
| `DELETE` | `/api/product/delete`   | `?idProduct={id}`                     |

#### Clients

| Método   | Ruta                   | Body / Params                          |
|----------|------------------------|----------------------------------------|
| `POST`   | `/api/client/new`      | `{ name, email }`                      |
| `GET`    | `/api/client/getAll`   | —                                      |
| `PUT`    | `/api/client/edit`     | `{ idClient, name, email }`            |
| `DELETE` | `/api/client/delete`   | `?idClient={id}`                       |

#### Providers

| Método   | Ruta                     | Body / Params                          |
|----------|--------------------------|----------------------------------------|
| `POST`   | `/api/provider/new`      | `{ name, phone }`                      |
| `GET`    | `/api/provider/getAll`   | —                                      |
| `PUT`    | `/api/provider/edit`     | `{ idProvider, name, phone }`          |
| `DELETE` | `/api/provider/delete`   | `?idProvider={id}`                     |

---

### Configuración y ejecución

#### Backend

1. Configurar la cadena de conexión en `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=TU_SERVIDOR;Database=TU_BASE;User Id=usuario;Password=clave;TrustServerCertificate=True;"
     }
   }
   ```

2. Ejecutar la API:
   ```bash
   dotnet run
   ```

   La API quedará disponible en `http://localhost:5170`.

#### Frontend

1. Instalar dependencias:
   ```bash
   cd vertical-slice-ui
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npx ng serve
   ```

   La app quedará disponible en `http://localhost:4200`.

> El backend ya tiene CORS configurado para aceptar peticiones desde `http://localhost:4200`.

---

### Acceso a datos

El proyecto usa **ADO.NET puro** (sin ORM) a través de la clase `ConnectionDB`, que provee instancias de `SqlConnection`. Los handlers ejecutan consultas SQL parametrizadas directamente.

### Estado en el frontend

Cada slice del frontend gestiona su propio estado mediante **Signals nativos de Angular** (`signal`, `computed`). No se usa NgRx ni ninguna librería externa de gestión de estado. El patrón por slice es:

```
_items    = signal<T[]>([])       // lista de registros
_loading  = signal(false)          // estado de carga
_selected = signal<T | null>(null) // registro seleccionado para editar
isEmpty   = computed(() => ...)    // derivado reactivo
```
