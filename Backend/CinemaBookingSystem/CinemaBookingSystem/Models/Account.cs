using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Account
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public Guid UserID { get; set; }
        public User User { get; set; }
    }
}
