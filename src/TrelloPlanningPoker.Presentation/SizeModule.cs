using System;
using System.Collections.Generic;
using System.Linq;
using NHibernate;
using NHibernate.Linq;
using Nancy;
using Nancy.ModelBinding;
using TrelloPlanningPoker.Domain;

namespace TrelloPlanningPoker.Presentation
{
    public class SizeModule: NancyModule
    {
        readonly ISession _session;

        public SizeModule(ISession session)
        {
            _session = session;

            Post["/game/{gameId}/card/{cardId}/size"] = r =>
                                                            {
                                                                var input = this.Bind<NewSizeInput>();
                                                                
                                                                var cardId = (string) r.cardId;

                                                                DeleteExistingSizesOnThisCardForThisUser(input, cardId);

                                                                var sizeId = Guid.NewGuid();
                                                                var size = new Size
                                                                               {
                                                                                   Id = sizeId,
                                                                                    CardId = cardId,
                                                                                    GameId = (string)r.gameId,
                                                                                    Username = input.Username,
                                                                                    Points = input.Points        ,
                                                                                    Created = DateTime.Now
                                                                               };
                                                                _session.Save(size);
                                                                return size;
                                                            };

            Get["/card/{cardId}/{username}/size"] = r =>
                                                        {
                                                            var cardId = (string)r.cardId;
                                                            var username = (string) r.username;

                                                            var size =
                                                                _session.QueryOver<Size>().Where(
                                                                    x => x.CardId == cardId && x.Username == username)
                                                                    .List().FirstOrDefault();
                                                            return size;
                                                        };

            Get["/card/{cardId}/sizes"] = r =>
                                              {
                                                  var cardId = (string) r.cardId;
                                                  var sizes =
                                                      _session.QueryOver<Size>().Where(
                                                          x => x.CardId == cardId).List();
                                                  return sizes;
                                              };

            Get["/game/{gameId}/aggregateSizes"] = r =>
                                              {
                                                  var gameId = (string) r.gameId;
                                                  IList<Size> sizes = _session.QueryOver<Size>().Where(x => x.GameId == gameId).List();

                                                  var num = 1;
                                                  return sizes.GroupBy(x => x.CardId)
                                                      .Select(x => new AggregateCardSizes
                                                                       {
                                                                           CardId = x.Key,
                                                                           Number = num++,
                                                                           Average = x.Average(s=> s.Points),
                                                                           Minimum = x.Min(s=> s.Points),
                                                                           Maximum = x.Max(s=> s.Points),
                                                                           Count = x.Count()
                                                                       });
                                              };
        }

        void DeleteExistingSizesOnThisCardForThisUser(NewSizeInput input, string cardId)
        {
            IList<Size> sizes = _session.QueryOver<Size>().Where(x => x.Username == input.Username && x.CardId == cardId).List();
            sizes.ForEach(x => _session.Delete(x));
        }
    }

    public class AggregateCardSizes
    {
        public string CardId { get; set; }
        public int Number { get; set; }
        public double Average { get; set; }
        public double Minimum { get; set; }
        public double Maximum { get; set; }
        public int Count { get; set; }
    }

    public class NewSizeInput
    {
        public string Username { get; set; }
        public double Points { get; set; }
    }
}