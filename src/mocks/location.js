import * as Location from "expo-location";

const tenMetersWithDegress = 0.0001;

let initialLocation;

const getLocation = (increment) => {
  const { coords = {} } = initialLocation || {};

  return {
    timestamp: new Date().getTime(),
    coords: {
      ...coords,
      longitude: coords.longitude + increment * tenMetersWithDegress,
      latitude: coords.latitude + increment * tenMetersWithDegress,
    },
  };
};

let counter, interval;
export const startMocking = (startingLocation) => {
  if (!startingLocation) return;

  initialLocation = startingLocation;

  counter = 0;
  interval = setInterval(() => {
    Location.EventEmitter.emit("Expo.locationChanged", {
      watchId: Location._getCurrentWatchId(),
      location: getLocation(counter),
    });

    counter++;
  }, 1000);
};

export const stopMocking = () => {
  clearInterval(interval);
  initialLocation = undefined;
};
