import React, { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';

import AppText from '../AppText';
import colors from '../../config/colors';
import ButtonIcon from './ButtonIcon';
import defaultStyles from '../../config/styles';
import NumberInputButton from './input/NumberInputButton';
import AppForm from '../AppForm';
import FormSubmitTickButton from './FormSubmitTickButton';

const NFluidInputModal = ({ name }) => {
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;

  const defaults = {
    day1: '60',
    day2: '80',
    day3: '100',
    day4: '120',
    day5: '150',
  };

  const storageKey = `${name.toLowerCase()}_fluid_requirements`;

  const [modalVisible, setModalVisible] = useState(false);
  const buttonText = name;
  const [values, setValues] = useState(defaults);
  const [showReset, setShowReset] = useState(false);

  const readItemFromStorage = async () => {
    let values;
    try {
      values = await AsyncStorage.getItem(storageKey);
    } catch (error) {
      console.log(`Error reading item: ${error}`);
    }
    if (values === null || values === undefined) {
      setValues(defaults);
    } else {
      const parsedValues = JSON.parse(values);
      setValues(parsedValues);
    }
  };

  const writeItemToStorage = async (newValues) => {
    const serialisedValues = JSON.stringify(newValues);
    try {
      await AsyncStorage.setItem(storageKey, serialisedValues);
    } catch (error) {
      console.log(`Error writing item: ${error}`);
    }
    setValues(newValues);
  };

  const wrongNumber = '↑ Are you sure about this amount?';
  const validationSchema = Yup.object().shape({
    day1: Yup.number()
      .min(40, wrongNumber)
      .max(120, wrongNumber)
      .required('Needed'),
    day2: Yup.number()
      .min(50, wrongNumber)
      .max(130, wrongNumber)
      .required('Needed'),
    day3: Yup.number()
      .min(60, wrongNumber)
      .max(140, wrongNumber)
      .required('Needed'),
    day4: Yup.number()
      .min(70, wrongNumber)
      .max(150, wrongNumber)
      .required('Needed'),
    day5: Yup.number()
      .min(80, wrongNumber)
      .max(200, wrongNumber)
      .required('Needed'),
  });

  useEffect(() => {
    readItemFromStorage();
  }, []);

  useEffect(() => {
    if (
      values.day1 !== '60' ||
      values.day2 !== '80' ||
      values.day3 !== '100' ||
      values.day4 !== '120' ||
      values.day5 !== '150'
    ) {
      if (!showReset) {
        setShowReset(true);
      }
    } else {
      setShowReset(false);
    }
  }, [values, showReset]);

  const resetInput = () => {
    Alert.alert('Are you sure you want to reset your custom values?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setShowReset(false);
          writeItemToStorage(defaults);
        },
      },
    ]);
  };

  const iconName = name === 'Term' ? 'water' : 'water-outline';

  const commonProps = {
    unitsOfMeasurement: ' ml/kg/day',
    global: false,
  };

  const inputButtons = [
    {
      name: 'day1',
      userLabel: '1st Day',
      iconName: 'numeric-1-circle',
      defaultValue: '60',
      userValue: values.day1 || defaults.day1,
    },
    {
      name: 'day2',
      userLabel: '2nd Day',
      iconName: 'numeric-2-circle',
      defaultValue: '80',
      userValue: values.day2 || defaults.day2,
    },
    {
      name: 'day3',
      userLabel: '3rd day',
      iconName: 'numeric-3-circle',
      defaultValue: '100',
      userValue: values.day3 || defaults.day3,
    },
    {
      name: 'day4',
      userLabel: '4th Day',
      iconName: 'numeric-4-circle',
      defaultValue: '120',
      userValue: values.day4 || defaults.day4,
    },
    {
      name: 'day5',
      userLabel: '5th+ Day',
      iconName: 'numeric-5-circle',
      defaultValue: '150',
      userValue: values.day5 || defaults.day5,
    },
  ];

  const renderButtons = inputButtons.map((element) => (
    <NumberInputButton
      {...commonProps}
      key={element.name}
      name={element.name}
      userLabel={element.userLabel}
      iconName={element.iconName}
      defaultValue={element.defaultValue}
      userValue={element.userValue}
    />
  ));

  const submitRequirements = (values) => {
    setValues(values);
    setModalVisible(false);
    writeItemToStorage(values);
  };

  const infoParagraph =
    'The default values are set based on NICE guidelines. Feel free to change them above to match local practice.';

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.textBox}>
            <ButtonIcon name={iconName} />
            <AppText
              style={{ color: colors.white }}
            >{`For ${buttonText} Infants`}</AppText>
          </View>
        </TouchableOpacity>
        {showReset && (
          <TouchableOpacity onPress={resetInput}>
            <ButtonIcon name={'refresh'} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log('Window closed');
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor: dark ? colors.darkSecondary : colors.light,
                },
              ]}
            >
              <AppForm
                initialValues={values}
                onSubmit={submitRequirements}
                validationSchema={validationSchema}
              >
                <AppText style={styles.title}>{`${name} Requirements`}</AppText>
                <KeyboardAwareScrollView style={{ alignSelf: 'center' }}>
                  {renderButtons}
                  <View style={styles.infoContainer}>
                    <AppText style={styles.infoTitle}>Note:</AppText>
                    <AppText style={styles.infoParagraph}>
                      {infoParagraph}
                    </AppText>
                  </View>
                </KeyboardAwareScrollView>
                <View style={styles.buttonContainer}>
                  <View style={styles.closeIcon}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <MaterialCommunityIcons
                        name="close-circle"
                        color={dark ? colors.white : colors.black}
                        size={40}
                      />
                    </TouchableOpacity>
                  </View>
                  <FormSubmitTickButton />
                </View>
              </AppForm>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default NFluidInputModal;

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.container,
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  modalView: {
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 15,
    paddingTop: 15,
    height:
      Dimensions.get('window').height * 0.7 > 570
        ? 570
        : Dimensions.get('window').height * 0.7,
  },
  infoContainer: {
    backgroundColor: colors.dark,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: defaultStyles.container.width * 0.85,
    alignSelf: 'center',
    margin: 5,
  },
  infoTitle: {
    paddingTop: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  infoParagraph: {
    paddingTop: 5,
    padding: 15,
    color: colors.white,
    fontSize: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    //backgroundColor: 'yellow',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingRight: 10,
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
  },
  title: {
    fontSize: 19,
    alignSelf: 'center',
    paddingBottom: 10,
  },
});
