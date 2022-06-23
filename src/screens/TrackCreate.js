import { useState, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Text, Input, Button } from "@rneui/themed";

import Map from "../components/Map";
import useLocation from "../hooks/useLocation";
import { usePostTracksMutation } from "../services/api/apiSlice";

const TrackForm = (props) => {
  const { form, isSaving, isRecording } = props;

  const handleRecording = () => {
    if (isSaving) return;

    if (!form.name) {
      return props.setForm({ error: "A name is required to start recording!" });
    }

    props.setForm({ error: "" });

    if (isRecording) {
      return props.saveRecording();
    }

    return props.startRecording();
  };

  return (
    <>
      <Input
        style={{ marginTop: 15 }}
        value={form.name}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Name for track"
        errorMessage={form.error}
        errorStyle={{ marginLeft: 0, marginBottom: 15 }}
        onChangeText={(name) => props.setForm({ name })}
      />

      <Button
        title={(isRecording ? "Save" : "Start") + " Recording"}
        type="solid"
        loading={isSaving}
        onPress={handleRecording}
      />
    </>
  );
};

const initialFormState = {
  name: null,
  error: "",
  locations: [],
  isValid: false,
};

const TrackCreate = ({ navigation }) => {
  const [form, setForm] = useState(initialFormState);

  const [locations, setLocations] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const locationsRef = useRef();
  locationsRef.current = locations;

  const isRecordingRef = useRef();
  isRecordingRef.current = isRecording;

  const isFocused = useIsFocused();

  const [postTracks, { isLoading: isSaving }] = usePostTracksMutation();

  const [err] = useLocation({
    callback: (location) => {
      isRecordingRef.current
        ? setLocations([...locationsRef.current, location])
        : setLocations([location]);
    },
    shouldTrack: isFocused || isRecording,
    useMock: true,
  });

  const handleStartRecording = () => {
    setForm({ ...initialFormState, name: form.name });
    setIsRecording(true);
  };

  const handleSaveRecording = () => {
    if (locations.length < 1) {
      return;
    }

    const data = [...locations];
    setForm(initialFormState);
    setIsRecording(false);

    return postTracks({ name: form.name, locations: data })
      .then(() => navigation.navigate("Tracks"))
      .catch(() => null);
  };

  if (err) {
    return <Text>Please grant permission for location services!</Text>;
  }

  return (
    <>
      <Text h2 h2Style={{ alignSelf: "center", marginBottom: 30 }}>
        Create Track
      </Text>

      {!locations.length ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Map locations={locations} showTrack={isRecording} />
          <TrackForm
            form={form}
            isSaving={isSaving}
            isRecording={isRecording}
            startRecording={handleStartRecording}
            saveRecording={() => handleSaveRecording()}
            setForm={(props) => setForm({ ...form, ...props })}
          />
        </>
      )}
    </>
  );
};

export default TrackCreate;
