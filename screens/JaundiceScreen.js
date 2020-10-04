import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from "yup";

import AppForm from "../components/AppForm";
import NCalcScreen from "../components/NCalcScreen";
import DobInputButton from "../components/buttons/input/DobInputButton";
import GestationInputButton from "../components/buttons/input/GestationInputButton";
import NumberInputButton from "../components/buttons/input/NumberInputButton";
import DomInputButton from "../components/buttons/input/DomInputButton";
import FormSubmitButton from "../components/buttons/FormSubmitButton";
import FormResetButton from "../components/buttons/FormResetButton";
import AppText from "../components/AppText";
import colors from "../config/colors";
import SmallButton from "../components/buttons/SmallButton";

import calculateJaundice from "../brains/calculateJaundice";

const JaundiceScreen = () => {
  const initialValues = {
    sbr: "",
    gestationInDays: 0,
    dob: null,
    dom: new Date(new Date().getTime() + 10 * 60000),
    domChanged: false,
  };

  const validationSchema = Yup.object().shape({
    sbr: Yup.number().required("↑ Please enter a serum bilirubin"),
    gestationInDays: Yup.number()
      .min(161, "↑ Please select a birth gestation")
      .required()
      .label("Birth Gestation"),
    dob: Yup.date()
      .nullable()
      .required("↑ Please enter a date of birth")
      .label("Date of Birth"),
  });

  return (
    <NCalcScreen>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={(values) => alert(calculateJaundice(values))}
            validationSchema={validationSchema}
          >
            <DobInputButton kind="neonate" renderTime={true} />
            <GestationInputButton kind="neonate" />
            <NumberInputButton
              iconName="water"
              name="sbr"
              userLabel="Serum Bilirubin"
              unitsOfMeasurement="μmol/l"
              kind="neonate"
              global={false}
            />
            <DomInputButton kind="neonate" renderTime={true} />
            <FormResetButton />
            <FormSubmitButton
              name="Calculate Treatment Thresholds"
              backgroundColor={colors.secondary}
              kind="neonate"
            />
          </AppForm>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.title}>
              <AppText style={styles.text}>Jaundice Treatment: </AppText>
            </View>
            <View style={styles.buttons}>
              <SmallButton name="information-outline" />
              <SmallButton name="chart-line" />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default JaundiceScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: "center",
    paddingHorizontal: 50,
    marginTop: 20,
    width: "100%",
    marginBottom: 75,
  },
  buttons: {
    // backgroundColor: "dodgerblue",
    flexDirection: "row",
    width: 96,
    justifyContent: "space-between",
  },
  outputContainer: {
    //backgroundColor: "orangered",
    alignSelf: "center",
    flexDirection: "row",
    flex: 2,
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
    width: "100%",
  },
  outputText: {
    //backgroundColor: "limegreen",
    color: colors.black,
    fontSize: 15,
    marginBottom: 40,
  },
  title: {
    alignContent: "center", //backgroundColor: "goldenrod",
    flexGrow: 2,
    justifyContent: "center",
    width: 150,
  },
  text: {
    color: colors.black,
    fontSize: 17,
  },
  topContainer: {
    alignSelf: "center",
    alignItems: "center",
    flex: 1,
  },
});
