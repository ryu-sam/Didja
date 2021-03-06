import React, {useContext} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import AppForm from '../components/AppForm';
import NCalcScreen from '../components/NCalcScreen';
import DateTimeInputButton from '../components/buttons/input/DateTimeInputButton';
import GestationInputButton from '../components/buttons/input/GestationInputButton';
import NumberInputButton from '../components/buttons/input/NumberInputButton';
import FormSubmitButton from '../components/buttons/FormSubmitButton';
import FormResetButton from '../components/buttons/FormResetButton';
import colors from '../config/colors';
import routes from '../navigation/routes';
import calculateJaundice from '../brains/calculateJaundice';
import ageChecker from '../brains/ageChecker';
import {handleOldValues} from '../brains/oddBits';
import {GlobalStatsContext} from '../components/GlobalStats';

const validationSchema = Yup.object().shape({
  sbr: Yup.number()
    .required('↑ Please enter a serum bilirubin')
    .max(1000, '↑ Are you sure about this measurement?'),
  gestationInDays: Yup.number()
    .min(161, '↑ Please select a birth gestation')
    .required()
    .nullable()
    .label('Birth Gestation'),
  dob: Yup.date()
    .nullable()
    .required('↑ Please enter a date and time birth')
    .label('Date of Birth'),
});

const initialValues = {
  sbr: '',
  gestationInDays: 0,
  dob: null,
  dom: null,
};

const JaundiceScreen = () => {
  const navigation = useNavigation();

  const {globalStats, setGlobalStats} = useContext(GlobalStatsContext);

  const handleFormikSubmit = (values) => {
    const checkAge = ageChecker(values, 14);
    if (checkAge === 'Negative age') {
      Alert.alert(
        'Time Travelling Patient',
        'Please check the dates entered',
        [{text: 'OK', onPress: () => null}],
        {cancelable: false},
      );
    } else if (checkAge === 'Too old') {
      Alert.alert(
        'Patient Too Old',
        'This calculator can only be used until 14 days of age',
        [{text: 'OK', onPress: () => null}],
      );
    } else {
      const submitFunction = () => {
        const results = calculateJaundice(values);
        const serialisedObject = JSON.stringify(results);
        navigation.navigate(routes.JAUNDICE_RESULTS, serialisedObject);
      };
      handleOldValues(
        submitFunction,
        'neonate',
        setGlobalStats,
        globalStats.neonate,
        initialValues,
      );
    }
  };

  return (
    <NCalcScreen style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.topContainer}>
          <AppForm
            initialValues={initialValues}
            onSubmit={handleFormikSubmit}
            validationSchema={validationSchema}>
            <DateTimeInputButton
              kind="neonate"
              type="birth"
              renderTime={true}
            />
            <GestationInputButton kind="neonate" />
            <NumberInputButton
              iconName="water"
              name="sbr"
              userLabel="Serum Bilirubin"
              unitsOfMeasurement="μmol/l"
              kind="neonate"
            />
            <DateTimeInputButton
              kind="neonate"
              type="measured"
              renderTime={true}
            />
            <FormResetButton kind="neonate" initialValues={initialValues} />
            <FormSubmitButton
              name="Calculate Treatment Thresholds"
              backgroundColor={colors.secondary}
              kind="neonate"
            />
          </AppForm>
        </View>
      </KeyboardAwareScrollView>
    </NCalcScreen>
  );
};

export default JaundiceScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    paddingHorizontal: 50,
    marginTop: 20,
    width: '100%',
    marginBottom: 75,
  },
  buttons: {
    // backgroundColor: "dodgerblue",
    flexDirection: 'row',
    width: 96,
    justifyContent: 'space-between',
  },
  outputContainer: {
    //backgroundColor: "orangered",
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 2,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 10,
    width: '100%',
  },
  outputText: {
    //backgroundColor: "limegreen",
    color: colors.black,
    fontSize: 15,
    marginBottom: 40,
  },
  title: {
    alignContent: 'center', //backgroundColor: "goldenrod",
    flexGrow: 2,
    justifyContent: 'center',
    width: 150,
  },
  text: {
    color: colors.black,
    fontSize: 17,
  },
  topContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
