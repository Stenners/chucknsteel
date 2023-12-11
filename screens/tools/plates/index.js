import { StyleSheet, Text, TextInput } from "react-native";
import { ViewWrapper } from "../../../components/viewWrapper";
import { useEffect, useState } from "react";
import plateCalc from "../../../utils/plateCalc";

export function Plates({ navigation }) {
  const [text, onChangeText] = useState('');
  const [plates, setPlates] = useState();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const value = plateCalc.calculate(text);
    const closestWeight = value.closestWeight || '';
    const plates = value.plates;

    if (closestWeight !== text) {
      setMessage(`Closest weight is ${closestWeight}`);
    }
    setPlates(plates);
  }, [text]);
  
  return (
    <ViewWrapper>
      <Text>Enter total weight in kgs.</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Text>{JSON.stringify(plates)}</Text>
      <Text>{message}</Text>
    </ViewWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
});

