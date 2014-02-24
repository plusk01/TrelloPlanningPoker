using System;
using AcklenAvenue.Data;
using FluentNHibernate.Automapping;
using FluentNHibernate.Cfg;
using FluentNHibernate.Conventions.Helpers;
using TrelloPlanningPoker.Domain;

namespace TrelloPlanningPoker.Data
{
    public class MappingScheme : IDatabaseMappingScheme<MappingConfiguration>
    {
        #region IDatabaseMappingScheme<MappingConfiguration> Members

        public Action<MappingConfiguration> Mappings
        {
            get
            {
                AutoPersistenceModel autoPersistenceModel = AutoMap.Assemblies(typeof (IEntity).Assembly)
                    .Where(t => typeof (IEntity).IsAssignableFrom(t))
                    .UseOverridesFromAssemblyOf<GameAutoMappingOverride>()
                    //.IncludeBase<LessonActionBase>()
                    .Conventions.Add(DefaultCascade.All());

                return x => x.AutoMappings.Add(autoPersistenceModel);
            }
        }

        #endregion
    }
}