using System;
using System.Linq;
using System.Net;
using System.Web.Http;
using WebApi.Models;
using WebApi.Repositories;
   
namespace WebApi.Controllers
{
    public class TaskApiController : ApiController
    {
        private readonly TaskRepository _repository = new TaskRepository();
        
        // GET api/values
        public IQueryable<Task> Get()
        {
            return _repository.GetAllTasks().AsQueryable();
        }

        // GET api/values/5
        public Task Get(Guid id)
        {
            Task task = _repository.GetTask(id);
            if (task == null)
            {
                // Returns a 404
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return task;
        }

        // POST api/values
        public Task Post([FromBody]Task value)
        {
           Task contact = _repository.AddTask(value);
           return contact;
        }

        // PUT api/values/5
        public void Put(Guid id, [FromBody]Task value)
        {
            if (!_repository.UpdateTask(id, value))
            {
                // Returns a 404
               throw new HttpResponseException(HttpStatusCode.NotFound);
           }
        }
        // PUT api/values/5
        public void Put([FromBody]Task value)
        {
            if (!_repository.UpdateTask(value.id, value))
            {
                // Returns a 404
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }

        // DELETE api/values/5
        public void Delete(Guid id)
        {
           if (!_repository.RemoveTask(id))
           {
               // Returns a 404
               throw new HttpResponseException(HttpStatusCode.NotFound);
           }
        }
    }
}