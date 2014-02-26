using System;
using Autofac;

namespace TrelloPlanningPoker.Presentation
{
    public class WebDependenciesConfigurationBootstrapperTask : IBootstrapperTask<ContainerBuilder>
    {
        #region IBootstrapperTask<ContainerBuilder> Members

        public Action<ContainerBuilder> Task
        {
            get
            {
                return builder =>
                           {
                               //builder.RegisterType<APIzerAccountUserValidator>().As
                               //    <IUserValidator>();
                           };
            }
        }

        #endregion
    }
}