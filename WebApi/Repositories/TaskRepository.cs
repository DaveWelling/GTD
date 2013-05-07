using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using Polymorphic;
using WebApi.Models;

namespace WebApi.Repositories
{
    public class TaskRepository
    {
        private readonly MongoServer _server;
        private readonly MongoDatabase _database;
        private readonly MongoCollection<Task> _tasks;

        public TaskRepository()
        {
            var client = new MongoClient(Properties.Settings.Default.MongoConnection);
            _server = client.GetServer();
            _database = _server.GetDatabase("IntegrityGTD", SafeMode.True);
            _tasks = _database.GetCollection<Task>("Tasks");
        }

        public IEnumerable<Task> GetAllTasks()
        {
            return _tasks.FindAll().ToList();
        }

        public Task GetTask(Guid id)
        {
            IMongoQuery query = Query.EQ("_id", id);
            return _tasks.Find(query).FirstOrDefault();
        }

        public Task AddTask(Task item)
        {
            item.lastPersisted = DateTime.Now;
            _tasks.Insert(item);
            return item;
        }

        public bool RemoveTask(Guid id)
        {
            IMongoQuery query = Query.EQ("_id", id);
            SafeModeResult result = _tasks.Remove(query);
            return result.DocumentsAffected == 1;
        }

        public bool UpdateTask(Guid id, Task task)
        {
            IMongoQuery query = Query.EQ("_id", id);
            IMongoUpdate update = Update
                .Set("title", Utility.Coalesce(task.title, ""))
                .Set("description", Utility.Coalesce(task.description, ""))
                .Set("status", Utility.Coalesce(task.status, ""))
                .Set("when", Utility.Coalesce(task.when, ""))
                .Set("where", Utility.Coalesce(task.where, ""))
                .Set("lastPersisted", DateTime.Now)
                .Set("children", new BsonArray(task.children));

            SafeModeResult result = _tasks.Update(query, update);
            return result.UpdatedExisting;
        }

    }
}