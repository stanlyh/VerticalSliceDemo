using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Clients
{
    public class EditClient
    {
        //Command
        public record EditClientCommand(int IdClient, string Name, string Email);

        //Handler
        public class EditClientHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(EditClientCommand value)
            {
                if (value.IdClient == 0)
                    throw new ArgumentException("El idCliente es requerido");

                if (string.IsNullOrWhiteSpace(value.Name))
                    throw new ArgumentException("El nombre del cliente es requerido");

                if (string.IsNullOrWhiteSpace(value.Email))
                    throw new ArgumentException("El email del cliente es requerido");

                var edited = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("update Client set Name = @Name, Email = @Email where IdClient = @IdClient", cn);
                    command.Parameters.AddWithValue("@IdClient", value.IdClient);
                    command.Parameters.AddWithValue("@Name", value.Name);
                    command.Parameters.AddWithValue("@Email", value.Email);
                    command.CommandType = System.Data.CommandType.Text;

                    edited = command.ExecuteNonQuery() != 0;
                }
                return edited;
            }
        }

        //Endpoint
        [ApiController]
        [Route("api/client")]
        public class EditClientController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpPut]
            [Route("edit")]
            public IActionResult Edit(EditClientCommand value)
            {
                try
                {
                    var edited = new EditClientHandler(_connectionDB).Handle(value);

                    return edited == true ? StatusCode(200, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al editar el cliente", detail = ex.Message });
                }
            }
        }
    }
}
