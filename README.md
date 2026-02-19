## Ejemplo de Vertical Slice en .NET

Proyecto de demostración que implementa la arquitectura **Vertical Slice** en una API REST con **.NET 9**. Cada funcionalidad (feature) está autocontenida en un solo archivo, agrupando comando/query, handler y controller.

### Tecnologías

- **.NET 9** / C#
- **ASP.NET Core Web API**
- **Microsoft.Data.SqlClient** (ADO.NET) para acceso a SQL Server
- **OpenAPI** para documentación de endpoints

### Estructura del proyecto

```
VerticalSliceDemo/
├── ContextDB/
│   └── ConnectionDB.cs          # Wrapper de conexión a SQL Server
├── Features/
│   └── Products/
│       ├── CreateProduct.cs     # POST   /api/product/new
│       ├── GetAllProduct.cs     # GET    /api/product/getAll
│       ├── EditProduct.cs       # PUT    /api/product/edit
│       └── DeleteProduct.cs     # DELETE /api/product/delete
├── Controllers/
│   └── WeatherForecastController.cs
├── Program.cs
├── appsettings.json
└── VerticalSliceDemo.csproj
```

### Arquitectura Vertical Slice

Cada archivo dentro de `Features/Products/` contiene todo lo necesario para una operación:

```
CreateProduct.cs
├── CreateProductCommand   (record)  → define la entrada
├── CreateProductHandler   (class)   → lógica de negocio y acceso a datos
└── CreateProductController (class)  → endpoint HTTP
```

Esto permite trabajar en una funcionalidad sin afectar las demás, facilitando el mantenimiento y la escalabilidad.

### Endpoints

| Método   | Ruta                    | Descripción              |
|----------|-------------------------|--------------------------|
| `POST`   | `/api/product/new`      | Crear un producto        |
| `GET`    | `/api/product/getAll`   | Listar todos los productos |
| `PUT`    | `/api/product/edit`     | Editar un producto       |
| `DELETE` | `/api/product/delete`   | Eliminar un producto     |

### Configuración

1. Configurar la cadena de conexión a SQL Server en `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=TU_SERVIDOR;Database=TU_BASE;User Id=usuario;Password=clave;TrustServerCertificate=True;"
     }
   }
   ```

2. Ejecutar la aplicación:
   ```bash
   dotnet run
   ```

3. La API estará disponible en `http://localhost:5170`.

### Acceso a datos

El proyecto utiliza **ADO.NET puro** (sin ORM) a través de la clase `ConnectionDB`, que provee instancias de `SqlConnection`. Los handlers ejecutan consultas SQL parametrizadas directamente.
