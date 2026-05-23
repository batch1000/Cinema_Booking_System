using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaBookingSystem.Models;
using StackExchange.Redis;

namespace CinemaBookingSystem.Services
{
    public class RedisService
    {
        private readonly IDatabase _db;

        public RedisService(RedisConnection redisConnection)
        {
            _db = redisConnection.Connection.GetDatabase();
        }

        public async Task SetAsync(string key, string value)
        {
            await _db.StringSetAsync(key, value);
        }

        public async Task SetAsync(string key, string value, TimeSpan expire)
        {
            await _db.StringSetAsync(key, value, expire);
        }

        public async Task<bool> SetIfNotExistAsync(string key, string value, TimeSpan expire)
        {
            return await _db.StringSetAsync(key, value, expire, When.NotExists);
        }

        public async Task<bool> SetIfNotExistAsync(string key, string value)
        {
            return await _db.StringSetAsync(key, value, null, When.NotExists);
        }

        public async Task<string> GetAsync(string key)
        {
            return await _db.StringGetAsync(key);
        }

        public async Task RemoveAsync(string key)
        {
            await _db.KeyDeleteAsync(key);
        }

        public async Task<bool> RemoveTimeToLiveAsync(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return false;

            return await _db.KeyPersistAsync(key);
        }

        public async Task<bool> ExtendTimeToLiveAsync(string key, TimeSpan newExpire)
        {
            if (string.IsNullOrWhiteSpace(key))
                return false;

            return await _db.KeyExpireAsync(key, newExpire);
        }

        public async Task AddToSetAsync(string key, string value)
        {
            await _db.SetAddAsync(key, value);
        }

        public async Task RemoveFromSetAsync(string key, string value)
        {
            await _db.SetRemoveAsync(key, value);
        }

        public async Task<List<string>> GetSetAsync(string key)
        {
            var values = await _db.SetMembersAsync(key);
            return values
                    .Select(v => v.ToString())
                    .ToList();
        }

        public async Task<DateTime?> GetExpireAtAsync(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return null;

            var ttl = await _db.KeyTimeToLiveAsync(key);

            if (ttl == null)
                return null;

            return DateTime.UtcNow.Add(ttl.Value);
        }

        public async Task<RedisResult> ExecuteScriptAsync(string script, RedisKey[] keys, RedisValue[] values)
        {
            return await _db.ScriptEvaluateAsync(script, keys, values);
        }
    }
}
