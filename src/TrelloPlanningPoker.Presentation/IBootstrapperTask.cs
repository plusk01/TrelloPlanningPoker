using System;

namespace TrelloPlanningPoker.Presentation
{
    public interface IBootstrapperTask<in T>
    {
        Action<T> Task { get; }
    }
}