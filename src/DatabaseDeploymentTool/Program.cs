using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading;
using AcklenAvenue.Data.NHibernate;
using DomainDrivenDatabaseDeployer;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using TrelloPlanningPoker.Data;

namespace DatabaseDeploymentTool
{
    class Program
    {
        static void Main(string[] args)
        {
            bool shouldDropDatabase = args.Length > 0 && args.Contains("drop");
            bool shouldCreateDatabase = args.Length > 0 && args.Contains("create");
            bool shouldSeedData = args.Length > 0 && args.Contains("seed");
            bool shouldMigrate = args.Length == 0 || args.Contains("migrate");
            
            //shouldDropDatabase = true;
            //shouldCreateDatabase = true;
            //shouldSeedData = true;
            //shouldHashPasswords = true;

            MsSqlConfiguration databaseConfiguration =
                MsSqlConfiguration.MsSql2008.ShowSql().ConnectionString(x => x.FromConnectionStringWithKey("PlanningPoker"));

            DatabaseDeployer dd = null;
            ISessionFactory sessionFactory = new SessionFactoryBuilder(new MappingScheme(), databaseConfiguration)
                .Build(cfg => { dd = new DatabaseDeployer(cfg); });

            if (shouldDropDatabase)
            {
                using (ISession sess = sessionFactory.OpenSession())
                {
                    using (IDbCommand cmd = sess.Connection.CreateCommand())
                    {
                        cmd.ExecuteSqlFile("dropForeignKeys.sql");
                        cmd.ExecuteSqlFile("dropPrimaryKeys.sql");
                        cmd.ExecuteSqlFile("dropTables.sql");
                    }
                }
                Console.WriteLine("");
                Console.WriteLine("Database dropped.");
                Thread.Sleep(1000);
            }

            if (shouldMigrate)
            {
                dd.Update();
                Console.WriteLine("");
                Console.WriteLine("Database tables/columns migrated.");
            }

            if (shouldCreateDatabase)
            {
                dd.Create();
                Console.WriteLine("");
                Console.WriteLine("Database tables/columns created.");
            }

            if (shouldSeedData)
            {
                ISession session = sessionFactory.OpenSession();
                using (ITransaction tx = session.BeginTransaction())
                {
                    dd.Seed(new List<IDataSeeder>
                                {
                                    //add data seeders here.
                                    
                                });
                    tx.Commit();
                }
                session.Close();
                sessionFactory.Close();

                Console.WriteLine("");
                Console.WriteLine("Seed data added.");
                Thread.Sleep(2000);
            }
        }
    }

    public static class DbCommandExtensions
    {
        public static void ExecuteSqlFile(this IDbCommand cmd, string filename)
        {
            var tr = new StreamReader(filename);
            string sql = tr.ReadToEnd();
            cmd.CommandText = sql;
            cmd.ExecuteNonQuery();
        }
    }
}