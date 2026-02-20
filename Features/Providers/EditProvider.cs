using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Providers
{
    public class EditProvider
    {
        //Command
        public record EditProviderCommand(int IdProvider, string Name, string Phone);

        //Handler
        public class EditProviderHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(EditProviderCommand value)
            {
                if (value.IdProvider == 0)
                    throw new ArgumentException("El idProveedor es requerido");

                if (string.IsNullOrWhiteSpace(value.Name))
                    throw new ArgumentException("El nombre del proveedor es requerido");

                if (string.IsNullOrWhiteSpace(value.Phone))
                    throw new ArgumentException("El teléfono del proveedor es requerido");

                var edited = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("update Provider set Name = @Name, Phone = @Phone where IdProvider = @IdProvider", cn);
                    command.Parameters.AddWithValue("@IdProvider", value.IdProvider);
                    command.Parameters.AddWithValue("@Name", value.Name);
                    command.Parameters.AddWithValue("@Phone", value.Phone);
                    command.CommandType = System.Data.CommandType.Text;

                    edited = command.ExecuteNonQuery() != 0;
                }
                return edited;
            }
        }

        //Endpoint
        [ApiController]
        [Route("api/provider")]
        public class EditProviderController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpPut]
            [Route("edit")]
            public IActionResult Edit(EditProviderCommand value)
            {
                try
                {
                    var edited = new EditProviderHandler(_connectionDB).Handle(value);

                    return edited == true ? StatusCode(200, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al editar el proveedor", detail = ex.Message });
                }
            }
        }
    }
}
