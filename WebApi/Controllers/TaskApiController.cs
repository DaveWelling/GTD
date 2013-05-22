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
        public IQueryable<TaskViewModel> Get()
        {
            return _repository.GetAllTasks().Select(t=>new TaskViewModel(t)).AsQueryable();
        }

        // GET api/values/5
        public TaskViewModel Get(string id)
        {
            Task task = _repository.GetTask(id);
            if (task == null)
            {
                // Returns a 404
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return new TaskViewModel(task);
        }

        // POST api/values
        public TaskViewModel Post([FromBody]TaskViewModel value)
        {
           Task task = _repository.AddTask(value.ToTask());
           return new TaskViewModel(task);
        }

        // PUT api/values/5
        public void Put(string id, [FromBody]TaskViewModel value)
        {
            if (!_repository.UpdateTask(id, value.ToTask()))
            {
                // Returns a 404
               throw new HttpResponseException(HttpStatusCode.NotFound);
           }
        }
        // PUT api/values/5
        public void Put([FromBody]TaskViewModel value)
        {
            if (!_repository.UpdateTask(value.id, value.ToTask()))
            {
                // Returns a 404
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }

        // DELETE api/values/5
        public void Delete(string id)
        {
           if (!_repository.RemoveTask(id))
           {
               // Returns a 404
               throw new HttpResponseException(HttpStatusCode.NotFound);
           }
        }
    }
}