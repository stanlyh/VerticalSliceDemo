using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Products
{
    public class EditProduct
    {
        //Command
        public record EditProductCommand(int IdProduct, string Name, int Price);

        //Handler
        public class EditProductHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(EditProductCommand value)
            {
                if (value.IdProduct == 0)
                    throw new ArgumentException("El idProducto es requerido");

                if (string.IsNullOrWhiteSpace(value.Name))
                    throw new ArgumentException("El nombre del producto es requerido");

                if (value.Price <= 0)
                    throw new ArgumentException("El precio debe ser mayor que cero");

                var edited = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("update Product set Name = @Name ,Price = @Price where IdProduct = @IdProduct", cn);
                    command.Parameters.AddWithValue("@IdProduct", value.IdProduct);
                    command.Parameters.AddWithValue("@Name", value.Name);
                    command.Parameters.AddWithValue("@Price", value.Price);
                    command.CommandType = System.Data.CommandType.Text;

                    edited = command.ExecuteNonQuery() != 0;
                }
                return edited;
            }
        }

        //Endpoint
        [ApiController]
        [Route("api/product")]
        public class EditProductController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpPut]
            [Route("edit")]
            public IActionResult Edit(EditProductCommand value)
            {
                try
                {
                    var edited = new EditProductHandler(_connectionDB).Handle(value);

                    return edited == true ? StatusCode(200, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al editar el producto", detail = ex.Message });
                }
            }
        }
    }
}
