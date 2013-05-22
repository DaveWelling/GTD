using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace WebApi.Models
{
    public class TaskViewModel : IEquatable<TaskViewModel>
    {
        public TaskViewModel()
        {
        }

        public TaskViewModel(Task task)
        {
            id = task.id;
            title = task.title;
            description = task.description;
            status = task.status;
            when = task.when;
            where = task.where;
            lastPersisted = DateTime.Parse(task.lastPersisted.Substring(0,19));
            children = Json.Decode<string[]>(task.children);
        }
        public string id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string status { get; set; }
        public string when { get; set; }
        public string where { get; set; }
        public string[] children { get; set; }
        public DateTime lastPersisted { get; set; }
        public bool Equals(TaskViewModel other)
        {
            return other.id == id;
        }
        public override bool Equals(object obj)
        {
            if (obj is TaskViewModel)
            {
                return ((TaskViewModel)obj).id == id;
            }
            return false;
        }
        public Task ToTask()
        {
            string dateString = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss -0400");                   
            var task = new Task
                {
                    id = id,
                    description = description,
                    lastPersisted = dateString,
                    status = status,
                    title = title,
                    when = when,
                    @where = @where,
                    children = Json.Encode(children)
                };
            return task;
        }
    }
}