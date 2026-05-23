using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace CinemaBookingSystem.Models
{
    public class RedisConnection
    {
        private readonly Lazy<ConnectionMultiplexer> _connection;

        public RedisConnection(string connectionString)
        {
            _connection = new Lazy<ConnectionMultiplexer>(() =>
                ConnectionMultiplexer.Connect(connectionString));
        }

        public ConnectionMultiplexer Connection => _connection.Value;
    }
}
