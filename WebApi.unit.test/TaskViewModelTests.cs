using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebApi.Models;

namespace WebApi.Tests.Unit
{
    [TestClass]
    public class TaskViewModelTests
    {
        [TestMethod]
        public void Ctor_hasChildrenString_ChildrenConvertedToArray()
        {
            var task = new Task();
            task.id = Guid.NewGuid().ToString();
            task.children = "['whatever','blahblah']";
            task.lastPersisted = "2013-12-31 12:13:14 -0400";
            var target = new TaskViewModel(task);
            Assert.AreEqual(target.children[0], "whatever");
            Assert.AreEqual(target.children[1], "blahblah");
        }
    }
}
