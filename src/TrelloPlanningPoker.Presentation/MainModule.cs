using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;

namespace TrelloPlanningPoker.Presentation
{
    public class MainModule : NancyModule
    {
        public MainModule()
        {
            Get["/"] = _ => View["index.html"];
        }
    }
}