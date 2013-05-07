﻿using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using System.Web.Http.Routing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using WebApi.Controllers;
using WebApi.Models;

namespace WebApi.Tests.Unit
{
    [TestClass]
    public class TaskControllerTests
    {
        private TaskApiController _webApiController;

        [TestInitialize]
        public void Initialize()
        {
            const string routeControllerName = "task";
            _webApiController = WebApiControllerHelpers.CreateWebApiController<TaskApiController>(routeControllerName);
            
        }

        [TestCleanup]
        public void Cleanup()
        {
            var allTasks = _webApiController.Get();
            foreach (var task in allTasks)
            {
                _webApiController.Delete(task.id);
            }
            _webApiController.Dispose();
            _webApiController = null;
        }

        [TestMethod]
        public void PostThree_Get_YieldsThree()
        {
            for (int i = 0; i < 3; i++)
            {
                Guid taskId = Guid.NewGuid();
                var task = new Task
                {
                    children = new Guid[] { },
                    description = string.Format("Child {0}", i),
                    id = taskId,
                    status = "Action Pending",
                    title = string.Format("Child {0}", i)
                };

                _webApiController.Post(task);
                
            }
            var result = _webApiController.Get();
            Assert.AreEqual(3, result.Count());
        }

        [TestMethod]
        public void PostDelete_Get_YieldsNull()
        {
            Guid taskId = Guid.NewGuid();
            var task = new Task
            {
                children = new Guid[] { },
                description = "1st Child",
                id = taskId,
                status = "Action Pending",
                title = "Child 1"
            };

            _webApiController.Post(task);
            var firstGet = _webApiController.Get(task.id);
            Assert.AreEqual(task, firstGet);
            _webApiController.Delete(taskId);

            try
            {
                var secondGet = _webApiController.Get(task.id);
                Assert.Fail();
            }
            catch (HttpResponseException ex)
            {
                Assert.AreEqual(HttpStatusCode.NotFound, ex.Response.StatusCode);
            }
        }

        [TestMethod]
        public void PostPutGet_ChangeTask_VerifyWithGet()
        {
            const string expectedStatus = "Complete";
            Guid taskId = Guid.NewGuid();
            var task = new Task
            {
                children = new Guid[] { },
                description = "1st Child",
                id = taskId,
                status = "Action Pending",
                title = "Child 1"
            };

            _webApiController.Post(task);

            task.status = expectedStatus;

            _webApiController.Put(taskId, task);

            var childResult = _webApiController.Get(taskId);

            Assert.AreEqual(expectedStatus, childResult.status);
        }

        [TestMethod]
        public void PostAndGet_CreateChildAndRoot_VerifyBothAreRetrieved()
        {
            Guid rootId = Guid.NewGuid();
            Guid childId = Guid.NewGuid();
            var rootExpected = new Task
                {
                    children = new Guid[] { childId },
                    description = "Root",
                    id = rootId,
                    status = "Action Pending",
                    title = "Root"
                };
            var childExpected = new Task
                {
                    children = new Guid[] { },
                    description = "1st Child",
                    id = childId,
                    status = "Action Pending",
                    title = "Child 1"
                };

            _webApiController.Post(rootExpected);
            _webApiController.Post(childExpected);
            var rootResult = _webApiController.Get(rootId);
            var childResult = _webApiController.Get(childId);

            Assert.AreEqual(rootExpected, rootResult);
            Assert.AreEqual(childExpected, childResult);
        }


    }

    public static class WebApiControllerHelpers
    {
        public static T CreateWebApiController<T>(string routeControllerName) where T : ApiController, new()
        {
            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post,
                                                 String.Format("http://localhost/api/{0}", routeControllerName));
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary {{"controller", routeControllerName}});
            var controller = new T();
            controller.ControllerContext = new HttpControllerContext(config, routeData, request);
            controller.Request = request;
            controller.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;
            return controller;
        }
    }
}
