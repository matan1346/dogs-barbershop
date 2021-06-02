using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using barbershop_server.DAL;
using barbershop_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace barbershop_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        [Route("logout")]
        [HttpPost]
        public bool Logout()
        {
            BarberShopDatabase.LogoutClient();

            return true;
        }

        [Route("session")]
        [HttpGet]
        public BarberClient Session()
        {
            return BarberShopDatabase.getAuthClient();
        }

        [Route("login")]
        [HttpPost]
        public BarberClient Login([FromBody] BarberClientLogin clientLogin)
        {
            return BarberShopDatabase.LoginClient(clientLogin);
        }

        [Route("register")]
        [HttpPost]
        public bool Register([FromBody] BarberClientRegister clientRegister)
        {
            return BarberShopDatabase.RegisterNewClient(clientRegister);
        }





    }
}
