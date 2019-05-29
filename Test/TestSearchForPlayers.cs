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
    public class TestSearchForPlayers {
        [Fact]
        public void SearchForPlayersWithNoCriteria() {
            //Arrange
            var playerRepos = new Mock<IRepository<Player>>();
            SearchCriteriaForPlayer sc = new SearchCriteriaForPlayer();
            playerRepos.Setup(x => x.GetAll())
                .Returns(new List<Player>
                {
                    new Player { Id = 1, Country = "Denmark" },
                    new Player { Id = 2, Country = "Sweden" },
                    new Player { Id = 3, Country = "Sweden" }
                });

            PlayerLogic pl = new PlayerLogic(null, playerRepos.Object, null);

            var list = pl.HandleSearchAlgorithm(sc);

            Assert.Equal(3, list.Count);
        }


        [Fact]
        // Testing search criteria. Player with ID 2 should be at number 1 in the list because he match both criterias
        public void SearchForPlayersWithLeaugeAndPosition() {
            //Arrange
            var playerRepos = new Mock<IRepository<Player>>();
            //Setup search criterias
            SearchCriteriaForPlayer sc = new SearchCriteriaForPlayer {
                PrimaryPosition = "Playmaker",
                League = "Second League"
            };

            playerRepos.Setup(x => x.GetBySearchCriteria(" p.isAvailable = 1 and p.league = 'Second League' and p.PrimaryPosition = 'Playmaker'"))
                .Returns(new List<Player>
                {
                    new Player { Id = 1, Country = "Denmark", League = "First League", PrimaryPosition = "Left back" },
                    new Player { Id = 2, Country = "Sweden", League = "Second League", PrimaryPosition = "Playmaker" },
                    new Player { Id = 3, Country = "Sweden", League = "Third League", PrimaryPosition = "Pivot" }
                });

            PlayerLogic pl = new PlayerLogic(null, playerRepos.Object, null);

            //Act
            var list = pl.HandleSearchAlgorithm(sc);

            Assert.Equal("Playmaker", list[0].PrimaryPosition);
        }

        [Fact]
        // Testing search criteria. Player with ID 6 should be at number 1 in the list because he match 
        // on 3/5 criteria with would be the highest percentage match and he will be number 1 in the list
        public void SearchForPlayersWithCalculatePercentage() {
            //Arrange
            var playerRepos = new Mock<IRepository<Player>>();
            //Setup search criterias
            SearchCriteriaForPlayer sc = new SearchCriteriaForPlayer {
                Country = "Sweden",
                League = "Second League",
                PrimaryPosition = "Pivot",
                InjuryStatus = "Healthy",
                MinimumHeight = 180

            };

            playerRepos.Setup(x => x.GetBySearchCriteria(" p.isAvailable = 1 and p.league = 'Second League' and p.PrimaryPosition = 'Pivot'"))
                .Returns(new List<Player>
                {
                    new Player { Id = 1, Country = "Denmark", League = "First League", PrimaryPosition = "Left back", InjuryStatus = "Healthy" },
                    new Player { Id = 2, Country = "Sweden", League = "Second League", PrimaryPosition = "Playmaker", InjuryStatus = "Healthy" },
                    new Player { Id = 3, Country = "Sweden", League = "Third League", PrimaryPosition = "Pivot", InjuryStatus = "Healthy" },
                    new Player { Id = 4, Country = "Norway", League = "Second League", PrimaryPosition = "Pivot", InjuryStatus = "Healthy" },
                    new Player { Id = 5, Country = "Norway", League = "Second League", PrimaryPosition = "Pivot", InjuryStatus = "Healthy" },
                    new Player { Id = 6, Country = "Sweden", League = "First League", PrimaryPosition = "Pivot", InjuryStatus = "Healthy", Height = 170 }
                });

            PlayerLogic pl = new PlayerLogic(null, playerRepos.Object, null);

            //Act
            var list = pl.HandleSearchAlgorithm(sc);

            Assert.Equal(60, list[0].SearchPercentage);
        }

        [Fact]
        public void SearchForPlayersWithOnlyStrength() {
            //Arrange
            var playerRepos = new Mock<IRepository<Player>>();
            //Setup search criterias
            List<string> strengthList = new List<string>() { "speedy", "Tactical", "Social" };
            List<string> strengthList2 = new List<string>() { "speedy", "Tactical"};
            SearchCriteriaForPlayer sc = new SearchCriteriaForPlayer {
                StrengthsList = strengthList
            };

            playerRepos.Setup(x => x.GetBySearchCriteria(" s.name = 'speedy' and p.isAvailable = 1 or s.name = 'Tactical' and p.isAvailable = 1 or s.name = 'Social' and p.isAvailable = 1"))
                .Returns(new List<Player>
                {
                    new Player { Id = 1, InjuryStatus = "Healthy", Height = 180},
                    new Player { Id = 2, InjuryStatus = "Healthy", Height = 170},
                    new Player { Id = 3, InjuryStatus = "Healthy", Height = 190},
                    new Player { Id = 4, InjuryStatus = "Healthy", Height = 170, StrengthList = strengthList2},
                    new Player { Id = 5, InjuryStatus = "Healthy", Height = 170},
                    new Player { Id = 6, InjuryStatus = "Healthy", Height = 170}
                });

            PlayerLogic pl = new PlayerLogic(null, playerRepos.Object, null);

            //Act
            var list = pl.HandleSearchAlgorithm(sc);

            Assert.Equal(66, list[0].SearchPercentage);
        }
    }
}
