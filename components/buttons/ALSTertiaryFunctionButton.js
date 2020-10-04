import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableHighlight, TouchableOpacity, useWindowDimensions, View } from 'react-native'

import colors from '../../config/colors'
import AppText from '../AppText'
import ButtonIcon from '../buttons/ButtonIcon'

const ALSTeriaryFunctionButton = ({ intervalState, logState, resetState, style, title }) => {

        const reset = resetState.value;
        const setReset = resetState.setValue;

        const functionButtons = logState.value;
        const setFunctionButtons = logState.setValue;

        const intervalTime = intervalState.value;

        const [changeBackground, setChangeBackground] = useState(false)

        const [showUndo, setShowUndo] = useState(false)

        //number of times pressed logic
        const [clicks, setClicks] = useState(0)

        // logs time with event button
        const updateTime = (title, oldState) => {
            const timeStamp = new Date();
            const oldButtonArray = oldState[title];
            const newButtonArray = oldButtonArray.concat(timeStamp);
                setFunctionButtons((oldState) => {
            const updatingState = oldState;
            updatingState[title] = newButtonArray;
                return updatingState;
            });
        }

        //uses state to change background button color after selected
       const handleChangeBackground = (changeBackground, oldState, title) => {
            const oldButtonArray = oldState[title]
            if (oldButtonArray.length < 2) {
                setChangeBackground(false)
                return changeBackground
            } else {
                return changeBackground
            }
       }


        const handlePress = () => {
        //some logic to prevent double pressing may need to go here
        setClicks(clicks + 1);
        setChangeBackground(true);
        updateTime(title, functionButtons);
        setShowUndo(true);
        console.log(functionButtons)
        
        }
        
        // handles undo click - changes background if appropriate and removes last added time
      const removeTime = (title, oldState) => {
          const oldButtonArray = oldState[title];
          if (oldButtonArray.length < 2 ) {
              setFunctionButtons((oldState) => {
                  const updatingState = oldState;
                  updatingState[title] = []
                  setShowUndo(false)
                  return updatingState
              })
         }  else {
            const newButtonArray = oldButtonArray.slice(0, -1)
            setFunctionButtons((oldState) => {
                const updatingState = oldState;
                updatingState[title] = newButtonArray
                setShowUndo(true)
                return updatingState;
         })
        }
    };


        // global undo click handling
        const handleUndo = () => {
            handleChangeBackground(changeBackground, functionButtons, title);
            removeTime(title, functionButtons)
            console.log(functionButtons)
            setClicks(clicks -1)
        }

        // reset button logic

        useEffect(() => {
            if (reset == true){    
                setChangeBackground(false);
                setClicks(0);
                setShowUndo(false);
            };
        }
        )
     
    return (
        <TouchableHighlight 
        activeOpacity={0.5}
        underlayColor={colors.light}
        onPress={handlePress}
        style={[ styles.button, style, changeBackground && styles.buttonPressed ]}
        pressed={changeBackground}
        title={title}
        >
         <View style={styles.content}>
         <AppText>{title}</AppText> 
         
         {showUndo && (
             <React.Fragment>
             <AppText>x{clicks}</AppText>
             <TouchableOpacity onPress={handleUndo}>
             <ButtonIcon name="refresh" backgroundColor={colors.primary} />
             </TouchableOpacity>
             </React.Fragment>
             )}
             </View>
        </TouchableHighlight>
    )
};

export default ALSTeriaryFunctionButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.medium,
        borderRadius: 5,
        flex: 1,
        flexDirection: "row",
        height: 57,
        margin: 5, 
        padding: 10,
        width: "98%",
        
    },
    buttonPressed: {
        backgroundColor: colors.primary,
        flexWrap: "nowrap",
    },
    content: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"

    }

})

