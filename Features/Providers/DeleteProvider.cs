using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Providers
{
    public class DeleteProvider
    {
        //Command
        public record DeleteProviderCommand(int IdProvider);

        //Handler
        public class DeleteProviderHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(DeleteProviderCommand value)
            {
                if (value.IdProvider == 0)
                    throw new ArgumentException("El idProveedor es requerido");

                var deleted = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("delete from Provider where IdProvider = @IdProvider", cn);
                    command.Parameters.AddWithValue("@IdProvider", value.IdProvider);
                    command.CommandType = System.Data.CommandType.Text;

                    deleted = command.ExecuteNonQuery() != 0;
                }
                return deleted;
            }
        }

        [ApiController]
        [Route("api/provider")]
        public class DeleteProviderController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpDelete]
            [Route("delete")]
            public IActionResult Delete(int idProvider)
            {
                try
                {
                    var command = new DeleteProviderCommand(idProvider);
                    var deleted = new DeleteProviderHandler(_connectionDB).Handle(command);

                    return deleted == true ? StatusCode(200, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al eliminar el proveedor", detail = ex.Message });
                }
            }
        }
    }
}
