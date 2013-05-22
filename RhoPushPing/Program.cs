using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace RhoPushPing
{
    class Program
    {
        private const string ApiToken = "my-rhoconnect-token";
        static void Main(string[] args)
        {
            perform_ping("Task", "Hello World", "2000");
        }

        private static bool perform_ping(String sourceName, String theMessage, String vibrateTime)
        {
            Hashtable reqHash = new Hashtable();
            // add meta information
            reqHash.Add("user_id", new[] { "admin" });
            reqHash.Add("source_id", sourceName);
            reqHash.Add("message", theMessage);
            reqHash.Add("vibrate", vibrateTime);
            //reqHash.Add("sound", soundFile);

            JavaScriptSerializer js = new JavaScriptSerializer();
            string requestBody = js.Serialize(reqHash);

            Uri address = new Uri("http://straylight:9292" + "/rc/v1/users/ping");
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(address);
            request.ContentType = "application/json";
            request.Method = "POST";
            request.Headers.Add("X-RhoConnect-API-TOKEN", ApiToken);

            byte[] byteData = UTF8Encoding.UTF8.GetBytes(requestBody);
            request.ContentLength = byteData.Length;
            using (Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(byteData, 0, byteData.Length);
            }
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                ;
            }

            return true;
        }
    }
}
