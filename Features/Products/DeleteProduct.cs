using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Products
{
    public class DeleteProduct
    {
        //Command
        public record DeleteProductCommand(int IdProduct);

        //Handler
        public class DeleteProductHandler(ConnectionDB _connectionDb)
        {
            public bool Handle(DeleteProductCommand value)
            {
                if (value.IdProduct == 0)
                    throw new ArgumentException("El idProducto es requerido");

                var deleted = false;

                using (var cn = _connectionDb.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("delete from Product where IdProduct = @IdProduct", cn);
                    command.Parameters.AddWithValue("@IdProduct", value.IdProduct);
                    command.CommandType = System.Data.CommandType.Text;

                    deleted = command.ExecuteNonQuery() != 0;
                }
                return deleted;
            }
        }

        [ApiController]
        [Route("api/product")]
        public class DeleteProductController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpDelete]
            [Route("delete")]
            public IActionResult Delete(int idProduct)
            {
                try
                {
                    var command = new DeleteProductCommand(idProduct);
                    var deleted = new DeleteProductHandler(_connectionDB).Handle(command);

                    return deleted == true ? StatusCode(200, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    // Retornar BadRequest (400) para errores de validación
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    // Retornar InternalServerError (500) para otros errores
                    return StatusCode(500, new { message = "Error interno al eliminar el producto", detail = ex.Message });
                }
            }
        }

    }
}
