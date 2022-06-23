import { useMemo } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Polyline, Circle } from "react-native-maps";

const getRegionForCoordinates = (coordinates = []) => {
  let minX,
    maxX,
    minY,
    maxY,
    offset = 0.0005;

  // init first point
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(coordinates[0]);

  // calculate rect
  coordinates.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = maxX - minX;
  const deltaY = maxY - minY;

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX + offset,
    longitudeDelta: deltaY + offset,
  };
};

const Map = ({ locations, showTrack = true, isHistoryView = false }) => {
  const coordinates = locations.map(({ coords: { latitude, longitude } }) => ({
    latitude,
    longitude,
  }));

  const currentLocation = coordinates[coordinates.length - 1];

  const region = useMemo(() => {
    if (!coordinates.length) return;

    return isHistoryView
      ? getRegionForCoordinates(coordinates)
      : { ...currentLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  }, [isHistoryView, coordinates]);

  if (!coordinates.length) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <MapView style={styles.map} region={region}>
      {showTrack && <Polyline coordinates={coordinates} />}

      {!isHistoryView && (
        <Circle
          center={currentLocation}
          radius={40}
          strokeColor="rgba(158, 158, 255, 1.0)"
          fillColor="rgba(158, 158, 255, 0.3)"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 300,
  },
});

export default Map;
