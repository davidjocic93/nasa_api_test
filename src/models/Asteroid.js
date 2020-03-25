import axios from "axios";
import { types } from "mobx-state-tree";

/**
 * The definition Asteroid
 *
 * @export {Object} Asteroid
 */
export const Asteroid = types
  .model("Asteroid", {
    links: types.model({
      self: types.string
    }),
    id: types.identifier,
    neo_reference_id: types.string,
    name: types.string,
    nasa_jpl_url: types.string,
    absolute_magnitude_h: 19.9,
    estimated_diameter: types.frozen(),
    is_potentially_hazardous_asteroid: types.boolean,
    close_approach_data: types.array(types.frozen()),
    is_sentry_object: types.boolean,
    approachingData: types.maybe(
        types.model("ApproachingData", {
          iterations: types.number,
          dates: types.frozen()
      })
    )
  })
  .actions(self => ({
    fetchApproachingData() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(self.getApproachDataUrl());
          const data = res.data;
          const approachingData = {
            iterations: data.close_approach_data.length,
            dates: data.close_approach_data
          };
          await self.setApproachingData(approachingData);
          resolve(approachingData);
        } catch (error) {
          console.error(error);
          reject();
        }
      })
    },
    setApproachingData(data) {
      return new Promise(async (resolve, reject) => {
        try {
          self.approachingData = data;
          resolve();
        } catch (error) {
          console.error(error);
          reject();
        }
      });
    }
  }))
  .views(self => ({
    getApproachDataUrl() {
      return self.links.self;
    }
  }));
