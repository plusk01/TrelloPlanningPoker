using Nancy;

namespace TrelloPlanningPoker.Presentation
{
    public class MainModule : NancyModule
    {
        public MainModule()
        {
            Get["/"] = _ =>
                           {
                               return View["index.html"];
                           };
        }
    }
}