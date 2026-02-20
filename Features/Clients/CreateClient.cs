using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Clients
{
    public class CreateClient
    {
        //Command
        public record CreateClientCommand(string Name, string Email);

        //Handler
        public class CreateClientHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(CreateClientCommand value)
            {
                if (string.IsNullOrWhiteSpace(value.Name))
                    throw new ArgumentException("El nombre del cliente es requerido");

                if (string.IsNullOrWhiteSpace(value.Email))
                    throw new ArgumentException("El email del cliente es requerido");

                var created = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("insert into Client(Name,Email) values(@Name,@Email)", cn);
                    command.Parameters.AddWithValue("@Name", value.Name);
                    command.Parameters.AddWithValue("@Email", value.Email);
                    command.CommandType = System.Data.CommandType.Text;

                    created = command.ExecuteNonQuery() != 0;
                }
                return created;
            }
        }

        //Endpoint
        [ApiController]
        [Route("api/client")]
        public class CreateClientController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpPost]
            [Route("new")]
            public IActionResult New(CreateClientCommand value)
            {
                try
                {
                    var created = new CreateClientHandler(_connectionDB).Handle(value);

                    return created == true ? StatusCode(201, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al crear el cliente", detail = ex.Message });
                }
            }
        }
    }
}
