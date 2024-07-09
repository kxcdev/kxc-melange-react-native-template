import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  Text,
} from "react-native";

export interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export function Button({ title, onPress }: ButtonProps): React.ReactElement {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    maxWidth: 200,
    borderRadius: 10,
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: "#ed2f52",
  },
  text: {
    textAlign: "center",
    fontFamily: "monospace",
    color: "white",
  },
});
