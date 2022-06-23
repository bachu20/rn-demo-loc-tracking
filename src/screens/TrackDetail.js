import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Text, Button } from "@rneui/base";
import Map from "../components/Map";
import { useGetTrackQuery } from "../services/api/apiSlice";

const TrackDetail = ({ navigation, route }) => {
  if (!route.params?.id) {
    return (
      <View style={styles.wrapper}>
        <Text h4 style={styles.helperText}>
          Select a track to view
        </Text>
        <Button
          title="View all tracks"
          onPress={() => navigation.navigate("Tracks")}
        />
      </View>
    );
  }

  const { data: { track } = {}, isLoading } = useGetTrackQuery(
    route.params?.id
  );

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <>
      <Text h3 style={{ marginBottom: 15 }}>
        {track.name}
      </Text>
      <Map locations={track?.locations ?? []} isHistoryView={true} />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    marginBottom: 200,
    flex: 1,
  },
  helperText: {
    marginBottom: 15,
    alignSelf: "center",
  },
});

export default TrackDetail;
