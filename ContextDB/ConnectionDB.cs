using Microsoft.Data.SqlClient;

namespace VerticalSliceDemo.ContextDB;

public class ConnectionDB(IConfiguration _config)
{
    public SqlConnection GetSQL()
    {
        return new SqlConnection(_config.GetConnectionString("SqlString"));
    }
}
