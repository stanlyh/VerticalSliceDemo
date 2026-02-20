using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Clients
{
    public class DeleteClient
    {
        //Command
        public record DeleteClientCommand(int IdClient);

        //Handler
        public class DeleteClientHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(DeleteClientCommand value)
            {
                if (value.IdClient == 0)
                    throw new ArgumentException("El idCliente es requerido");

                var deleted = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("delete from Client where IdClient = @IdClient", cn);
                    command.Parameters.AddWithValue("@IdClient", value.IdClient);
                    command.CommandType = System.Data.CommandType.Text;

                    deleted = command.ExecuteNonQuery() != 0;
                }
                return deleted;
            }
        }

        [ApiController]
        [Route("api/client")]
        public class DeleteClientController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpDelete]
            [Route("delete")]
            public IActionResult Delete(int idClient)
            {
                try
                {
                    var command = new DeleteClientCommand(idClient);
                    var deleted = new DeleteClientHandler(_connectionDB).Handle(command);

                    return deleted == true ? StatusCode(200, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al eliminar el cliente", detail = ex.Message });
                }
            }
        }
    }
}
