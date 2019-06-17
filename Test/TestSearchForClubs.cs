using System;
using Xunit;
using Api.DAL;
using Moq;
using Api.DAL.Repos;
using Api.DataTransferObjects;
using System.Collections.Generic;
using Api.DAL.Entities;
using Api.BusinessLogic;

namespace Test {
    public class TestSearchForClubs {
        [Fact]
        public void SearchForClubWithNoCriteria() {
            //Arrange
            var clubRepos = new Mock<IClubRepository<Club>>();
            ClubSearchCriteria cc = new ClubSearchCriteria();
            clubRepos.Setup(x => x.GetAll())
                .Returns(new List<Club>
                {
                    new Club { Id = 1, Country = "Denmark" },
                    new Club { Id = 2, Country = "Sweden" },
                    new Club { Id = 3, Country = "Sweden" }
                });

            ClubLogic cl = new ClubLogic(null, clubRepos.Object, null, null);

            var list = cl.HandleClubSearchAlgorithm(cc, 0);

            Assert.Equal(3, list.Count);
        }

        [Fact]
        public void SearchForClubWithCountry() {
            //Arrange
            ClubSearchCriteria cc = new ClubSearchCriteria();
            cc.Country = "Denmark";

            var playerRepos = new Mock<IRepository<Player>>();
            playerRepos.Setup(x => x.GetById(1)).Returns(new Player { Id = 1 });

            var clubRepos = new Mock<IClubRepository<Club>>();
            clubRepos.Setup(x => x.GetBySearchCriteriaWithJobPosition())
                .Returns(new List<Club>
                {
                    new Club { Id = 1, Country = "Sweden" },
                    new Club { Id = 2, Country = "Denmark" },
                    new Club { Id = 3, Country = "Norway" }
                });

            ClubLogic cl = new ClubLogic(null, clubRepos.Object, playerRepos.Object, null);

            var list = cl.HandleClubSearchAlgorithm(cc, 1);

            Assert.Equal("Denmark", list[0].Country);
        }

        [Fact]
        public void SearchForClubWithCountryLeague() {
            //Arrange Search Criterias
            ClubSearchCriteria cc = new ClubSearchCriteria();
            cc.Country = "Denmark";
            cc.League = "Second League";

            //Arrange Player used to match with club jobposition
            var playerRepos = new Mock<IRepository<Player>>();
            playerRepos.Setup(x => x.GetById(1)).Returns(new Player { Id = 1 });

            //Arrange Club 
            var clubRepos = new Mock<IClubRepository<Club>>();
            clubRepos.Setup(x => x.GetBySearchCriteriaWithJobPosition(" c.isAvailable = 1  and c.league = 'Second League' and isavailable = 1  and c.country = 'Denmark' and isavailable = 1 "))
                .Returns(new List<Club>
                {
                    new Club { Id = 1, Country = "Sweden", League = "First League" },
                    new Club { Id = 2, Country = "Denmark", League = "Second League" },
                    new Club { Id = 3, Country = "Norway", League = "First League" }
                });

            ClubLogic cl = new ClubLogic(null, clubRepos.Object, playerRepos.Object, null);

            var list = cl.HandleClubSearchAlgorithm(cc, 1);

            Assert.Equal(2, list[0].Id);
        }

        [Fact]
        public void SearchForClubWithJobPositionWith5OutOf6CriteriaMatch() {
            //Arrange Search Criterias
            ClubSearchCriteria cc = new ClubSearchCriteria();
            cc.Country = "Denmark";
            cc.League = "Second League";
            cc.Position = "Left back";
            JobPosition jp = new JobPosition {
                Position = "Left back",
                Height = 190,
                PreferredHand = " Right hand"
            };
            List<JobPosition> l = new List<JobPosition>();
            l.Add(jp);

            //Arrange Player used to match with club jobposition
            var playerRepos = new Mock<IRepository<Player>>();
            playerRepos.Setup(x => x.GetById(1)).Returns(new Player { Id = 1, PrimaryPosition = "Left back", Height = 191, PreferredHand = "Left hand" });

            //Arrange Club 
            var clubRepos = new Mock<IClubRepository<Club>>();
            clubRepos.Setup(x => x.GetBySearchCriteriaWithJobPosition(" c.isAvailable = 1  and c.league = 'Second League' " +
                "and isavailable = 1  and c.country = 'Denmark' and isavailable = 1  and jp.position = 'Left back' and isavailable = 1 "))
                .Returns(new List<Club>
                {
                    new Club { Id = 1, Country = "Sweden", League = "First League" },
                    new Club { Id = 2, Country = "Denmark", League = "Second League", JobPositionsList = l },
                    new Club { Id = 3, Country = "Norway", League = "First League" }
                });


            ClubLogic cl = new ClubLogic(null, clubRepos.Object, playerRepos.Object, null);

            var list = cl.HandleClubSearchAlgorithm(cc, 1);

            Assert.Equal(83, list[0].SearchPercentage);
        }

        [Fact]
        public void SearchForClubWithJobPositionAndValues() {
            //Arrange Search Criterias
            List<string> values = new List<string>();
            values.Add("Hard working");
            values.Add("Social cohesion");
            ClubSearchCriteria cc = new ClubSearchCriteria();
            cc.ValuesList = values;
            JobPosition jp = new JobPosition {
                Position = "Left back",
                Height = 190,
                PreferredHand = " Right hand"
            };
            List<JobPosition> l = new List<JobPosition> { jp };
            JobPosition jp2 = new JobPosition {
                Position = "Right back",
                Height = 200,
                PreferredHand = "Right hand"
            };
            List<JobPosition> l2 = new List<JobPosition> { jp2 };


            //Arrange Player used to match with club jobposition
            var playerRepos = new Mock<IRepository<Player>>();
            playerRepos.Setup(x => x.GetById(1)).Returns(new Player { Id = 1, PrimaryPosition = "Left back", Height = 195, PreferredHand = "Left hand" });

            //Arrange Club 
            var clubRepos = new Mock<IClubRepository<Club>>();
            clubRepos.Setup(x => x.GetBySearchCriteriaWithJobPoisitionValue(" v.name = 'Hard working' and c.isAvailable = 1  or v.name = 'Social cohesion' and c.isAvailable = 1 ", ""))
                .Returns(new List<Club>
                {
                    new Club { Id = 1, Country = "Sweden", League = "First League" },
                    new Club { Id = 2, Country = "Denmark", League = "Second League", JobPositionsList = l, ValuesList = values },
                    new Club { Id = 3, Country = "Norway", League = "First League", JobPositionsList = l2, ValuesList = values }
                });


            ClubLogic cl = new ClubLogic(null, clubRepos.Object, playerRepos.Object, null);

            var list = cl.HandleClubSearchAlgorithm(cc, 1);

            Assert.Equal(80, list[0].SearchPercentage);
        }
    }
}
