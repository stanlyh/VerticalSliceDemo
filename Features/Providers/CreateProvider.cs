using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Providers
{
    public class CreateProvider
    {
        //Command
        public record CreateProviderCommand(string Name, string Phone);

        //Handler
        public class CreateProviderHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(CreateProviderCommand value)
            {
                if (string.IsNullOrWhiteSpace(value.Name))
                    throw new ArgumentException("El nombre del proveedor es requerido");

                if (string.IsNullOrWhiteSpace(value.Phone))
                    throw new ArgumentException("El teléfono del proveedor es requerido");

                var created = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("insert into Provider(Name,Phone) values(@Name,@Phone)", cn);
                    command.Parameters.AddWithValue("@Name", value.Name);
                    command.Parameters.AddWithValue("@Phone", value.Phone);
                    command.CommandType = System.Data.CommandType.Text;

                    created = command.ExecuteNonQuery() != 0;
                }
                return created;
            }
        }

        //Endpoint
        [ApiController]
        [Route("api/provider")]
        public class CreateProviderController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpPost]
            [Route("new")]
            public IActionResult New(CreateProviderCommand value)
            {
                try
                {
                    var created = new CreateProviderHandler(_connectionDB).Handle(value);

                    return created == true ? StatusCode(201, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al crear el proveedor", detail = ex.Message });
                }
            }
        }
    }
}
