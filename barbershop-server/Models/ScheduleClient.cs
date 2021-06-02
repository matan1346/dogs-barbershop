using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace barbershop_server.Models
{
    public class ScheduleClient
    {
        public int ScheduleID { get; set; }
        public int ClientID { get; set; }
        public DateTime ScheduleTime { get; set; }
        public DateTime RegisteredRecord { get; set; }
        public BarberClient Client { get; set; }

    }
}
