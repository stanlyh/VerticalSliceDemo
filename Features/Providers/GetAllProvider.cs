using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Providers
{
    public class GetAllProvider
    {
        //Request
        public record GetAllProviderQuery();

        //Response
        public record GetAllProviderResponse(int IdProvider, string Name, string Phone);

        //Handler
        public class GetAllProviderHandler(ConnectionDB _connectionDB)
        {
            public List<GetAllProviderResponse> Handle(GetAllProviderQuery value)
            {
                var providers = new List<GetAllProviderResponse>();

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("select IdProvider,Name,Phone from Provider", cn);
                    command.CommandType = System.Data.CommandType.Text;

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            providers.Add(new GetAllProviderResponse(
                                int.Parse(reader["IdProvider"].ToString()!),
                                reader["Name"].ToString()!,
                                reader["Phone"].ToString()!
                                ));
                        }
                    }
                }
                return providers;
            }
        }

        //EndPoint
        [ApiController]
        [Route("api/provider")]
        public class GetAllProviderController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpGet]
            [Route("getAll")]
            public IActionResult GetAll()
            {
                var query = new GetAllProviderQuery();
                var providers = new GetAllProviderHandler(_connectionDB).Handle(query);
                return Ok(providers);
            }
        }
    }
}
