using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using barbershop_server.DAL;
using barbershop_server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace barbershop_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        [HttpGet]
        public List<ScheduleClient> Get()
        {
            return BarberShopDatabase.getScheduleList().OrderBy(x => x.ScheduleTime).ToList();
        }

        [Route("create")]
        [HttpPut]
        public BarberShopDatabase.ScheduleStatus Put(ScheduleRegister scheduleData)
        {
            if (BarberShopDatabase.getAuthClient() == null)
                return BarberShopDatabase.ScheduleStatus.NOT_LOGGED_IN;
            return BarberShopDatabase.RegisterNewScheduleClient(scheduleData);
        }

        [Route("edit")]
        [HttpPost]
        public BarberShopDatabase.ScheduleStatus Post(ScheduleRegister scheduleData)
        {
            if (BarberShopDatabase.getAuthClient() == null)
                return BarberShopDatabase.ScheduleStatus.NOT_LOGGED_IN;
            if (!BarberShopDatabase.IsScheduleBelongsToClient(scheduleData.ClientID))
                return BarberShopDatabase.ScheduleStatus.NOT_BELONGS;
            return BarberShopDatabase.EditScheduleClient(scheduleData);
        }

        [Route("delete/{scheduleID}")]
        [HttpDelete]
        public BarberShopDatabase.ScheduleStatus Delete(int scheduleID)
        {
            if (BarberShopDatabase.getAuthClient() == null)
                return BarberShopDatabase.ScheduleStatus.NOT_LOGGED_IN;
            if (!BarberShopDatabase.IsScheduleBelongsToClient(scheduleID))
                return BarberShopDatabase.ScheduleStatus.NOT_BELONGS;
            return BarberShopDatabase.DeleteScheduleClient(scheduleID);
        }
    }
}
