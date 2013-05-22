using System;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApi.Models
{
    [BsonIgnoreExtraElements]
	public class Task : IEquatable<Task>
	{
        [BsonElement("_id")]
		public string id { get; set; }
		public string title { get; set; }
		public string description { get; set; }
		public string status { get; set; }
		public string when { get; set; }
		public string where { get; set; }
		public string children { get; set; }
        public string lastPersisted { get; set; }
	    public bool Equals(Task other)
	    {
	        return other.id == id;
	    }
        public override bool Equals(object obj)
        {
            if (obj is Task)
            {
                return ((Task) obj).id == id;
            }
            return false;
        }
	}
}