﻿using System;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApi.Models
{
	public class Task : IEquatable<Task>
	{
        [BsonId]
		public Guid id { get; set; }
		public string title { get; set; }
		public string description { get; set; }
		public string status { get; set; }
		public string when { get; set; }
		public string where { get; set; }
		public Guid[] children { get; set; }
        public DateTime lastPersisted { get; set; }
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