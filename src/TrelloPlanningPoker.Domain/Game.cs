using System;

namespace TrelloPlanningPoker.Domain
{
    public class Game : IEntity
    {
        public virtual Guid Id { get; set; }
        public virtual string Creator { get; set; }
        public virtual DateTime Created { get; set; }
        public virtual string BoardId { get; set; }
        public virtual string ListId { get; set; }
        public virtual string Name { get; set; }
    }
}