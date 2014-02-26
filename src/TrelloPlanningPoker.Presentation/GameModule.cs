using System;
using NHibernate;
using Nancy;
using Nancy.ModelBinding;
using TrelloPlanningPoker.Domain;

namespace TrelloPlanningPoker.Presentation
{
    public class GameModule: NancyModule
    {
        readonly ISession _session;

        public GameModule(ISession session)
        {
            _session = session;

            Post["game"] = r => NewGame(this.Bind<NewGameInput>());
            Get["game/{gameId}"] = r =>
                                       {
                                           var gameId = Guid.Parse(r.gameId);
                                           return GetGame(gameId);
                                       };
            Get["games/{username}"] = r =>
                                          {
                                              var username = (string) r.username;
                                              return _session.QueryOver<Game>().Where(x => x.Creator == username).List();
                                          };
        }

        dynamic GetGame(Guid gameId)
        {
            return _session.Get<Game>(gameId);
        }

        dynamic NewGame(NewGameInput input)
        {
            var id = Guid.NewGuid();
            var newGame = new Game
                              {
                                  Id = id,
                                  Creator = input.Username,
                                  Created = DateTime.Now,
                                  BoardId = input.BoardId,
                                  ListId = input.ListId,
                                  Name = input.Name
                              };
            _session.Save(newGame);
            return newGame;
        }
    }

    public class NewGameInput
    {
        public string Username { get; set; }
        public string BoardId { get; set; }
        public string ListId { get; set; }
        public string Name { get; set; }
    }
}