using System.Collections.Generic;
using Autofac;
using Nancy.Bootstrappers.Autofac;
using Nancy.Conventions;
using Nancy.Diagnostics;

namespace TrelloPlanningPoker.Presentation
{
    public class Bootstrapper : AutofacNancyBootstrapper
    {
        protected override DiagnosticsConfiguration DiagnosticsConfiguration
        {
            get { return new DiagnosticsConfiguration { Password = @"acklenAvenue" }; }
        }

        protected override void ConfigureConventions(NancyConventions conventions)
        {
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("app"));

            base.ConfigureConventions(conventions);
        }

        protected override void ConfigureApplicationContainer(ILifetimeScope existingContainer)
        {
            var tasks = new List<IBootstrapperTask<ContainerBuilder>>
                            {
                                new WebDependenciesConfigurationBootstrapperTask(),
                                new DatabaseConfigurationBootstrapperTask(),
                            };
            var builder = new ContainerBuilder();
            tasks.ForEach(task => task.Task.Invoke(builder));
            builder.Update(existingContainer.ComponentRegistry);
        }
    }
}