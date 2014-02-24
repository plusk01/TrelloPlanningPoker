using FluentNHibernate.Automapping;
using FluentNHibernate.Automapping.Alterations;
using TrelloPlanningPoker.Domain;

namespace TrelloPlanningPoker.Data
{
    public class GameAutoMappingOverride : IAutoMappingOverride<Game>
    {
        public void Override(AutoMapping<Game> mapping)
        {
            mapping.Id(x => x.Id).GeneratedBy.Assigned();
        }
    }
}