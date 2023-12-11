import { Text, TextInput, Button, StyleSheet } from "react-native";
import { ViewWrapper } from "../../components/viewWrapper";
import { useState } from "react";
import { emailAuth } from "../../services/firebase";

export function LoginScreen({ navigation }) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log(userName, password);
    const res = await emailAuth(userName, password);
    console.log('res', res);
  };

  return (
    <ViewWrapper>
      <Text>Login</Text>
      <TextInput
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin}></Button>
    </ViewWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
});
