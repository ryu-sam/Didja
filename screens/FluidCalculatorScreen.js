import React, {useContext, useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import PCalcScreen from '../components/PCalcScreen';
import colors from '../config/colors';
import calculateCentile from '../brains/calculateCentile';
import ageChecker from '../brains/ageChecker';
import calculateFluid from '../brains/calculateFluid';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormResetButton from '../components/buttons/FormResetButton';
import AppForm from '../components/AppForm';
import routes from '../navigation/routes';
import {GlobalStatsContext} from '../components/GlobalStats';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import Zeit from '../brains/Zeit';
import useAgeEffect from '../brains/useAgeEffect';
import {handleOldValues} from '../brains/oddBits';
import UnitsSwitcher from '../components/buttons/UnitsSwitcher';
import BinarySelector from '../components/buttons/input/BinarySelector';

const oneMeasurementNeeded = "↑ We'll need this measurement";
const wrongUnitsMessage = (units) => {
  return `↑ Are you sure your input is in ${units}?`;
};

const initialValues = {
  weight: '',
  sex: '',
  gestationInDays: 280,
  dob: null,
  correction: '100',
  dom: null,
  deficit: '',
};

const FluidCalculatorScreen = () => {
  const navigation = useNavigation();

  const {globalStats, moveDataAcrossGlobal, setGlobalStats} = useContext(
    GlobalStatsContext,
  );
  const [showGestation, setShowGestation] = useState(false);
  const [isDeficit, setIsDeficit] = useState(false);

  const formikRef = useRef(null);

  const validationSchema = Yup.object().shape({
    weight: Yup.number()
      .min(0.1, wrongUnitsMessage('kg'))
      .max(250, wrongUnitsMessage('kg'))
      .required(oneMeasurementNeeded),
    correction: Yup.number()
      .min(50, 'Minimum calculator correction = 50% of normal')
      .max(150, 'Maximum calculator correction = 150% of normal'),
    sex: Yup.string().required('↑ Please select a sex').label('Sex'),
    deficit: isDeficit
      ? Yup.string()
          .required('↑ Please select a dehydration severity')
          .label('Dehydration')
      : Yup.string(),
    dob: Yup.date()
      .nullable()
      .required('↑ Please enter a date of Birth')
      .label('Date of Birth'),
  });

  const handleFormikSubmit = (values) => {
    const {gestationInDays} = values;
    const ageObject = new Zeit(values.dob, values.dom);
    const correctedGestation = gestationInDays + ageObject.calculate('days');
    const ageCheck = ageChecker(values, 6575, 28);
    switch (true) {
      case ageCheck === 'Negative age':
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{text: 'OK', onPress: () => null}],
          {cancelable: false},
        );
        break;
      case ageCheck === 'Over 18':
        Alert.alert(
          'Patient Too Old',
          'This calculator can only be used under 18 years of age',
          {text: 'OK', onPress: () => null},
          {cancelable: false},
        );
        break;
      case (gestationInDays < 259 && correctedGestation < 295) ||
        ageCheck === 'Too young':
        Alert.alert(
          'Neonatal Patient',
          'This calculator can only be used for non-neonatal fluid calculations. Do you want to be taken to the correct calculator?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                moveDataAcrossGlobal('neonate', initialValues);
                navigation.navigate('RootN', {screen: routes.NEONATE_FLUID});
              },
            },
          ],
        );
        break;
      default:
        const submitFunction = () => {
          let correction = values.correction;
          let mode = 'percentage';
          if (isDeficit) {
            correction = values.deficit === 'Moderate' ? 5 : 10;
            mode = 'deficit';
          }
          const ageInYears = ageObject.calculate('years');
          const results = calculateFluid(
            values.weight,
            values.sex,
            mode,
            correction,
            ageInYears,
          );
          const centileObject = calculateCentile(values);
          const measurements = values;
          const serialisedObject = JSON.stringify({
            results,
            centileObject,
            measurements,
          });
          navigation.navigate(routes.FLUID_RESULTS, serialisedObject);
        };
        handleOldValues(
          submitFunction,
          'child',
          setGlobalStats,
          globalStats.child,
          initialValues,
        );
    }
  };

  const dob = globalStats.child.dob;
  const dom = globalStats.child.dom;
  useAgeEffect(dob, dom, formikRef, setShowGestation);

  return (
    <PCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            innerRef={formikRef}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton kind="child" type="birth" />
            {showGestation && (
              <GestationInputButton name="gestationInDays" kind="child" />
            )}
            <BinarySelector
              kind="child"
              name="sex"
              userLabel="Sex"
              trueValue="Male"
              falseValue="Female"
              iconName="all-inclusive"
            />
            <NumberInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
              kind="child"
            />
            {isDeficit && (
              <BinarySelector
                kind="child"
                name="deficit"
                userLabel="Dehydration"
                trueValue="Severe"
                falseValue="Moderate"
                iconName="water"
              />
            )}
            {!isDeficit && (
              <NumberInputButton
                name="correction"
                defaultValue="100"
                userLabel="Percentage of Normal"
                iconName="triangle-outline"
                unitsOfMeasurement="%"
                kind="child"
              />
            )}
            <DateTimeInputButton kind="child" type="measured" />
            <UnitsSwitcher
              isUnits={isDeficit}
              setIsUnits={setIsDeficit}
              falseUnits="Maintenance"
              trueUnits="Deficit"
            />
            <FormResetButton
              kind="child"
              initialValues={initialValues}
              setIsValue={setIsDeficit}
            />
            <FormSubmitButton name="Calculate IV fluid rate" kind="child" />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default FluidCalculatorScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    paddingLeft: 50,
    marginTop: 20,
  },
  text: {
    color: colors.black,
    fontSize: 17,
  },
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
