using System;

namespace TrelloPlanningPoker.Domain
{
    public class Game : IEntity
    {
        public Guid Id { get; private set; }
    }
}