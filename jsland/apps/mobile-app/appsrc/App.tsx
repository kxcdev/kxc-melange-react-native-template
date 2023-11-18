/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useMemo, useState } from "react";
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
  LearnMoreLinks,
  ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";

import IntroHeader from "./components/IntroHeader";

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

  type ScreenSelection = "intro" | "accumulator";
  const [screenSelection, setScreenSelection] =
    useState<ScreenSelection>("intro");

  function SelectedScreen() {
    switch (screenSelection) {
      case "intro":
        return <IntroScreen />;
      case "accumulator":
        return <AccumulatorExample initialAccumulatorValue={33} />;
      default:
        return (
          <Text>
            Internal error:{" "}
            <Text>{`unexpected screenSelection = ${screenSelection}`}</Text>
          </Text>
        );
    }
  }

  const selectedScreen = useMemo(SelectedScreen, [screenSelection]);

  function AccumulatorExample(props: { initialAccumulatorValue?: number }) {
    return (
      <View style={{ flexGrow: 1 }}>
        <Button
          title=" >> Introduction Screen << "
          onPress={() => setScreenSelection("intro")}
        />
        <MelangeBridged.AccumulatorExample {...props} />
      </View>
    );
  }

  function IntroScreen() {
    const camlsec = MelangeBridged.OCamlSection;

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
          <IntroHeader />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
          >
            <Section title={MelangeBridged.step1_title}>
              Edit <Text style={styles.highlight}>appsrc/App.tsx</Text> to
              change this screen and then come back to see your edits.
              {"\n\n"}
              Code written in OCaml (Melange) code is imported at
              <Text style={styles.highlight}>
                melsrc/entrypoint.ml
              </Text> via <Text style={styles.highlight}>melsrc/bridge.ts</Text>
              .
            </Section>
            <Section title={camlsec.sectionTitle}>
              <camlsec.Body initialCounterValue={1} />
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
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {selectedScreen}
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
