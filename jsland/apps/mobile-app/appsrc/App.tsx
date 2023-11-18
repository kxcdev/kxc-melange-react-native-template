/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from "react";
import type { PropsWithChildren } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import * as MelangeBridged from "../melsrc/bridge";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const ocamlSection = MelangeBridged.OCamlSection;

  type ScreenSelection = "intro" | "accumulator";
  const [screenSelection, setScreenSelection] =
    useState<ScreenSelection>("intro");

  function SelectedScreen() {
    switch (screenSelection) {
      case "intro":
        return <IntroScreen />;
      case "accumulator":
        return <AccumulatorExample />;
      default:
        return (
          <Text>
            Internal error:{" "}
            <Text>{`unexpected screenSelection = ${screenSelection}`}</Text>
          </Text>
        );
    }
  }

  function AccumulatorExample() {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Button
          title=" >> Introduction Screen << "
          onPress={() => setScreenSelection("intro")}
        />
        <Text>Accumulator Example</Text>
      </ScrollView>
    );
  }

  function IntroScreen() {
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
          <Button
            title=" >> Accumulator Example << "
            onPress={() => setScreenSelection("accumulator")}
          />
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
          >
            <Section title={MelangeBridged.step1_title}>
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title={ocamlSection.sectionTitle}>
              <ocamlSection.Body initialCounterValue={1} />
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <SelectedScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
