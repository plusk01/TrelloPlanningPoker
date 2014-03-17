using System;

namespace TrelloPlanningPoker.Domain
{
    public class Size : IEntity
    {
        public virtual Guid Id { get; set; }

        public virtual double Points { get; set; }

        public virtual string Username { get; set; }

        public virtual string CardId { get; set; }

        public virtual string GameId { get; set; }

        public virtual DateTime Created { get; set; }
    }
}