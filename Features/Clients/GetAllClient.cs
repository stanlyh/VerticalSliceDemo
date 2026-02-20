using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using VerticalSliceDemo.ContextDB;

namespace VerticalSliceDemo.Features.Clients
{
    public class GetAllClient
    {
        //Request
        public record GetAllClientQuery();

        //Response
        public record GetAllClientResponse(int IdClient, string Name, string Email);

        //Handler
        public class GetAllClientHandler(ConnectionDB _connectionDB)
        {
            public List<GetAllClientResponse> Handle(GetAllClientQuery value)
            {
                var clients = new List<GetAllClientResponse>();

                using (var cn = _connectionDB.GetSQL())
                {
                    cn.Open();
                    var command = new SqlCommand("select IdClient,Name,Email from Client", cn);
                    command.CommandType = System.Data.CommandType.Text;

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            clients.Add(new GetAllClientResponse(
                                int.Parse(reader["IdClient"].ToString()!),
                                reader["Name"].ToString()!,
                                reader["Email"].ToString()!
                                ));
                        }
                    }
                }
                return clients;
            }
        }

        //EndPoint
        [ApiController]
        [Route("api/client")]
        public class GetAllClientController(ConnectionDB _connectionDB) : ControllerBase
        {
            [HttpGet]
            [Route("getAll")]
            public IActionResult GetAll()
            {
                var query = new GetAllClientQuery();
                var clients = new GetAllClientHandler(_connectionDB).Handle(query);
                return Ok(clients);
            }
        }
    }
}
