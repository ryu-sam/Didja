import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useFormikContext } from 'formik';

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';
import { GlobalStateContext } from '../../GlobalStateContext';

const ChestMovementInputButton = ({
  global = false,
  name = 'chestMovement',
}) => {
  const [showInput, setShowInput] = useState(false);
  const [buttonText, setButtonText] = useState('Chest');
  const [showCancel, setShowCancel] = useState(false);
  const [localCM, setLocalCM] = useState('');

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (localCM) {
        setButtonText(`Chest: ${localCM}`);
        setShowCancel(true);
        if (!global) {
          setFieldValue(name, localCM);
        }
      } else {
        setButtonText(`Chest`);
        setShowCancel(false);
      }
    } else {
      if (!localCM) {
        setLocalCM('Chest Moving');
      }
      setShowInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText('Chest');
    setShowInput(false);
    setLocalCM('');
    if (!global) {
      setFieldValue(name, '');
    }
    setShowCancel(false);
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && localCM && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowInput(false);
          setShowCancel(false);
          setButtonText('Chest');
          setLocalCM('');
        }
      }
    }
  });

  return (
    <React.Fragment>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="circle-expand" />
              <AppText style={{ color: colors.white }}>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="delete-forever" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showInput && (
        <>
          <View
            style={
              scheme === 'dark'
                ? styles.darkPickerContainer
                : styles.lightPickerContainer
            }
          >
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocalCM(itemValue);
              }}
              selectedValue={localCM}
            >
              <Picker.Item label="Chest Moving" value="Chest Moving" />
              <Picker.Item label="Chest Not Moving" value="Chest Not Moving" />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default ChestMovementInputButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: Dimensions.get('window').width * 0.85,
  },
  buttonTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.72,
  },
  picker: {
    height: 200,
    width: 280,
  },
  lightPickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  darkPickerContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: colors.light,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.85,
  },
});
