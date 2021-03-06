import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';

const BPResultsScreen = ({route, navigation}) => {
  const parameters = JSON.parse(route.params);

  const QTcTitle = `QT: ${
    parameters.measurements.qtinterval * 1000
  } milliseconds`;
  let ageBeforeCorrection = parameters.centileObject.ageBeforeCorrection;
  let ageAfterCorrection = parameters.centileObject.ageAfterCorrection;
  if (parameters.centileObject.kind === 'birth') {
    ageAfterCorrection = '0 days';
    ageBeforeCorrection = 'not corrected';
  }

  const [QTc, reference] = parameters.QTCOutput;

  return (
    <PCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueAfterCorrection={ageAfterCorrection}
          valueBeforeCorrection={ageBeforeCorrection}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{backgroundColor: colors.light}}
          textStyle={{color: colors.black}}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{QTcTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{`QTc: ${QTc}`}</AppText>
              </View>
            </View>
          </View>
          <View style={styles.reference}>
            <AppText style={styles.referenceTitle}>Reference values:</AppText>
            <AppText
              style={
                styles.referenceOutput
              }>{`${reference}\n\nCalculations based on small squares assumes a paper speed of 25mm/s`}</AppText>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default BPResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    //backgroundColor: "dodgerblue",
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 75,
    height: '100%',
  },
  outputContainer: {
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 110,
    width: '100%',
  },
  outputTextBox: {
    paddingLeft: 20,
    paddingRight: 10,
    //backgroundColor: 'limegreen',
    textAlign: 'left',
    justifyContent: 'center',
    flex: 8,
  },
  outputText: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  topContainer: {
    marginTop: 5,
  },
  reference: {
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.medium,
    width: '80%',
    padding: 10,
  },
  referenceTitle: {
    paddingTop: 15,
    paddingBottom: 5,
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  referenceOutput: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 15,
    padding: 5,
  },
  text: {
    fontSize: 17,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
});
