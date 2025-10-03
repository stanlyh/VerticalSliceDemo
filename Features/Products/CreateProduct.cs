using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;
using System.ComponentModel;

namespace VerticalSliceDemo.Features.Products
{
    public class CreateProduct
    {
        //Command
        public record CreateProductCommand(string Name, int Price);

        //Handler
        public class CreateProductHandler(ConnectionDB _connectionDB)
        {
            public bool Handle(CreateProductCommand value)
            {
                if (string.IsNullOrWhiteSpace(value.Name))
                    throw new ArgumentException("El nombre del producto es requerido");

                if (value.Price <= 0)
                    throw new ArgumentException("El precio debe ser mayor que cero");


                var created = false;

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("insert into Product(Name,Price) values(@Name,@Price)", cn);
                    command.Parameters.AddWithValue("@Name", value.Name);
                    command.Parameters.AddWithValue("@Price", value.Price);
                    command.CommandType = System.Data.CommandType.Text;

                    created = command.ExecuteNonQuery() != 0;
                }
                return created;


            }
        }

        //Endpoint
        [ApiController]
        [Route("api/product")]
        public class CreateProductController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpPost]
            [Route("new")]
            public IActionResult New(CreateProductCommand value)
            {
                try
                {
                    var created = new CreateProductHandler(_connectionDB).Handle(value);

                    return created == true ? StatusCode(201, new { message = "ok" }) :
                        StatusCode(409, new { message = "error" });
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(new { message = ex.Message, detail = "" });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error interno al crear el producto", detail = ex.Message });
                }
            }
        }
    }
}
