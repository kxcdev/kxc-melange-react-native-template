// adopted from react-native/Libraries/NewAppScreen/components/Header.js
//          and react-native/Libraries/NewAppScreen/components/HermesBadge.js

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React, { FunctionComponent } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { ocaml_version } from "../../melsrc/bridge";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
  const HermesInternal: null | {
    getRuntimeProperties?: () => Record<string, unknown>;
  };
}

const HermesBadge: FunctionComponent = () => {
  const styles = StyleSheet.create({
    badge: {
      position: "absolute",
      top: 8,
      right: 12,
    },
    badgeText: {
      fontSize: 14,
      fontWeight: "600",
      textAlign: "right",
    },
  });

  const isDarkMode = useColorScheme() === "dark";
  const version =
    global.HermesInternal?.getRuntimeProperties?.()["OSS Release Version"] ??
    "";
  return global.HermesInternal ? (
    <View style={styles.badge}>
      <Text
        style={[
          styles.badgeText,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {`Engine: Hermes ${version}`}
      </Text>
      <Text
        style={[
          styles.badgeText,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {`OCaml / Melange version: ${ocaml_version}`}
      </Text>
    </View>
  ) : (
    <View style={styles.badge}>
      <Text
        style={[
          styles.badgeText,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {`Engine: JavaScriptCore`}
      </Text>
      <Text
        style={[
          styles.badgeText,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {`OCaml / Melange version: ${ocaml_version}`}
      </Text>
    </View>
  );
};

const Header: FunctionComponent = () => {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <ImageBackground
      accessibilityRole="image"
      testID="new-app-screen-header"
      source={require("./ocaml-icon.png")}
      style={[
        styles.background,
        {
          backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        },
      ]}
      imageStyle={styles.logo}
    >
      <HermesBadge />
      <Text
        style={[
          styles.text,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        Welcome to
        {"\n"}
        React Native w/
        {"\n"}
        OCaml (Melange)
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingBottom: 40,
    paddingTop: 96,
    paddingHorizontal: 32,
  },
  logo: {
    opacity: 0.2,
    overflow: "visible",
    resizeMode: "cover",
    /*
     * These negative margins allow the image to be offset similarly across screen sizes and component sizes.
     *
     * The source logo.png image is 512x512px, so as such, these margins attempt to be relative to the
     * source image's size.
     */
    marginLeft: -128,
    marginBottom: -192,
  },
  text: {
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default Header;
