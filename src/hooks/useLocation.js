import { useState, useEffect } from "react";
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
  getCurrentPositionAsync,
  Accuracy,
} from "expo-location";

import { startMocking, stopMocking } from "../mocks/location";

export default ({
  callback = () => null,
  useMock = false,
  shouldTrack = true,
}) => {
  const [err, setErr] = useState();
  const [subscription, setSubscription] = useState();

  const startWatchingPosition = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErr("Permission to access location was denied");
        return;
      }

      if (useMock) {
        const initialLocation = await getCurrentPositionAsync({});
        startMocking(initialLocation);
      }

      const subscription = await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => callback(location)
      );

      setSubscription(subscription);
    } catch (error) {
      setErr(error);
    }
  };

  useEffect(() => {
    shouldTrack
      ? startWatchingPosition()
      : subscription?.remove() && setSubscription(null);

    return () => {
      useMock && stopMocking();
      subscription?.remove();
    };
  }, [shouldTrack]);

  return [err];
};
