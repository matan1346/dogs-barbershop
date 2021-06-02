using barbershop_server.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace barbershop_server.DAL
{
    public static class BarberShopDatabase
    {
        public enum ScheduleStatus
        {
            OK=0, NOT_LOGGED_IN=1,NOT_FOUND=2, NOT_BELONGS=3, ALREADY_TAKEN=4,UNKNOWN_ERROR=5
        };

        private static BarberClient authClient = null;
        private static SqlConnection getConnection()
        {

            string connectionString = @"Server = (LocalDB)\LocalDBDemo;" +
                            "Database = BarberShop;" +
                            "Integrated Security = true";
            return new SqlConnection(connectionString);
        }
        
        public static bool isClientExist(string userName)
        {
            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ClientExist", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@UserName", userName));

                // execute the command
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    // iterate through results, printing each to console
                    if (rdr.Read())
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public static bool IsScheduleBelongsToClient(int scheduleID)
        {
            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("IsScheduleBelongsToClient", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@ScheduleID", scheduleID));
                cmd.Parameters.Add(new SqlParameter("@ClientID", authClient.ClientID));

                // execute the command
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    // iterate through results, printing each to console
                    if (rdr.Read())
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public static List<ScheduleClient> getScheduleList()
        {
            List<ScheduleClient> scheduleList = null;
            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ScheduleList", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;


                // execute the command
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    scheduleList = new List<ScheduleClient>();
                    // iterate through results, printing each to console
                    while (rdr.Read())
                    {
                        scheduleList.Add(new ScheduleClient
                        {
                            ScheduleID = (int)rdr["ScheduleID"],
                            ClientID = (int)rdr["ClientID"],
                            ScheduleTime = (DateTime)rdr["ScheduleTime"],
                            RegisteredRecord = (DateTime)rdr["RegisteredRecord"],
                            Client = new BarberClient { 
                                ClientID = (int)rdr["ClientID"], 
                                userName = rdr["UserName"].ToString(),
                                firstName = rdr["FirstName"].ToString()
                            }
                        });
                    }

                }
            }
            return scheduleList;
        }

        public static ScheduleStatus DeleteScheduleClient(int scheduleID)
        {

            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ScheduleDelete", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@ScheduleID", scheduleID));

                Int32 rowsAffected = cmd.ExecuteNonQuery();
                //Console.WriteLine("RowsAffected: {0}", rowsAffected);
                if (rowsAffected > 0)
                    return ScheduleStatus.OK;
                return ScheduleStatus.NOT_FOUND;
            }
        }

        public static ScheduleStatus EditScheduleClient(ScheduleRegister scheduleData)
        {

            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ScheduleEdit", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@scheduleID", scheduleData.ClientID));
                cmd.Parameters.Add(new SqlParameter("@scheduleTime", DateTime.Parse(scheduleData.ScheduleTime)));


                var returnParameter = cmd.Parameters.Add("@ReturnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;


                Int32 rowsAffected = cmd.ExecuteNonQuery();
                ScheduleStatus status = (ScheduleStatus)returnParameter.Value;
                return status;
            }
        }

        public static ScheduleStatus RegisterNewScheduleClient(ScheduleRegister scheduleData)
        {
            
            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ScheduleRegister", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@ClientID", scheduleData.ClientID));
                cmd.Parameters.Add(new SqlParameter("@scheduleTime", DateTime.Parse(scheduleData.ScheduleTime)));

                var returnParameter = cmd.Parameters.Add("@ReturnVal", SqlDbType.Int);
                returnParameter.Direction = ParameterDirection.ReturnValue;

                Int32 rowsAffected = cmd.ExecuteNonQuery();
                ScheduleStatus status = (ScheduleStatus)returnParameter.Value;


                return status;
            }
        }


        public static bool RegisterNewClient(BarberClientRegister clientLogin)
        {
            // check if username is already exist
            if (isClientExist(clientLogin.userName))
                return false;

            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ClientRegister", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@UserName", clientLogin.userName));
                cmd.Parameters.Add(new SqlParameter("@FirstName", clientLogin.firstName));
                cmd.Parameters.Add(new SqlParameter("@Password", clientLogin.password));


                Int32 rowsAffected = cmd.ExecuteNonQuery();
                //Console.WriteLine("RowsAffected: {0}", rowsAffected);
                if (rowsAffected > 0)
                    return true;

            }
            return false;
        }

        public static BarberClient getAuthClient()
        {
            return authClient;
        }

        public static void LogoutClient()
        {
            authClient = null;
        }

        public static BarberClient LoginClient(BarberClientLogin clientLogin)
        {
            authClient = getClientLogin(clientLogin);
            return authClient;
        }

        public static BarberClient getClientLogin(BarberClientLogin clientLogin)
        {
            using (SqlConnection conn = getConnection())
            {
                conn.Open();

                // 1.  create a command object identifying the stored procedure
                SqlCommand cmd = new SqlCommand("ClientLogin", conn);

                // 2. set the command object so it knows to execute a stored procedure
                cmd.CommandType = CommandType.StoredProcedure;

                // 3. add parameter to command, which will be passed to the stored procedure
                cmd.Parameters.Add(new SqlParameter("@UserName", clientLogin.userName));
                cmd.Parameters.Add(new SqlParameter("@Password", clientLogin.password));

                // execute the command
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    // iterate through results, printing each to console
                    if (rdr.Read())
                    {
                        return new BarberClient { 
                            ClientID = (int)(rdr["ClientID"]),
                            userName=rdr["UserName"].ToString(),
                            firstName = rdr["FirstName"].ToString()};
                    }
                }
            }
            return null;
        }

    }
}
