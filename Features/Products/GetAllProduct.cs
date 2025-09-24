using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Products
{
    public class GetAllProduct
    {
        //request
        public record GetAllProductQuery();

        //Response
        public record GetAllProductResponse(int IdProduct, string Name, int Price);

        //Handler
        public class GetAllProductHandler(ConnectionDB _connectionDB)
        {
            public List<GetAllProductResponse> Handle(GetAllProductQuery value)
            {


                var products = new List<GetAllProductResponse>();

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("select IdProduct,Name,Price from Product", cn);
                    command.CommandType = System.Data.CommandType.Text;

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            products.Add(new GetAllProductResponse(
                                int.Parse(reader["IdProduct"].ToString()!),
                                reader["Name"].ToString()!,
                                int.Parse(reader["Price"].ToString()!)
                                ));
                        }
                    }
                }
                return products;
            }
        }

        //EndPoint
        [ApiController]
        [Route("api/product")]
        public class GetAllProductController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpGet]
            [Route("getAll")]
            public IActionResult GetAll()
            {
                var query = new GetAllProductQuery();
                var products = new GetAllProductHandler(_connectionDB).Handle(query);
                return Ok(products);
            }
        }
    }
}
