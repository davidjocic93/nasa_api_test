import axios from "axios";

import { types, destroy } from "mobx-state-tree";

import { Asteroid } from "./Asteroid";
import { buildUrl } from "../services/Utils";

/**
 * The definition of the Store that will be used in the application
 *
 * @export {Object} Store
 */
export const Store = types
  .model("Store", {
    asteroids: types.optional(types.array(Asteroid), []),
    selectedAsteroids: types.optional(types.array(types.reference(Asteroid)), []),
    searchTriggered: false
  })
  .actions(self => ({
    fetchAsteroids(startDate, endDate) {
      return new Promise(async (resolve, reject) => {
        try {
          self.setSearchTriggered(true);
          self.clearSelectedAsteroids();
          let asteroids = [];
          const response = await axios.get(buildUrl(startDate, endDate));
          for (const date in response.data.near_earth_objects) {
            const hazardousAsteroids = response.data.near_earth_objects[date]
              .filter(({ is_potentially_hazardous_asteroid }) => is_potentially_hazardous_asteroid);
            asteroids = [...asteroids, ...hazardousAsteroids];
          };
          self.setAsteroids(asteroids);
          resolve();
        } catch (error) {
          console.error(error);
          reject();
        }
      });
    },
    setSearchTriggered(searchTriggered) {
      self.searchTriggered = searchTriggered;
    },
    setAsteroids(asteroids) {
      self.asteroids = asteroids;
    },
    addSelectedAsteroid(asteroid) {
      self.selectedAsteroids.push(asteroid);
    },
    clearSelectedAsteroids() {
      destroy(self.selectedAsteroids);
    },
    removeSelectedAsteroid(asteroid) {
      const index = self.selectedAsteroids.indexOf(asteroid);
      self.selectedAsteroids.splice(index, 1);
    }
  }))
  .views(self => ({
    getUnselectedAsteroids() {
      return self.asteroids
        .filter(({ id }) => !self.selectedAsteroids.some(({ id: selectedId }) => selectedId === id));
    },
    getAsteroidsSortedByIterations() {
      let filteredByYear = [];
      self.selectedAsteroids.forEach(asteroid => {
        const data = { id: asteroid.id, name: asteroid.name, iterations: 0}
        const filteredDates = asteroid.approachingData.dates
          .filter(({ close_approach_date: date }) => {
            const year = date.split("-")[0];
            return year > 1900 && year <= 1999;
          });

        data.iterations = filteredDates.length;
        filteredByYear.push(data);
      });
      
      const compareByIteration = (a, b) => {
        if (a.iterations < b.iterations) return -1;
        if (a.iterations > b.iterations) return 1;
        return 0;
      };

      return filteredByYear.sort(compareByIteration);
    }
  }));
