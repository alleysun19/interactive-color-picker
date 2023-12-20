// import React, { Component } from 'react'

import React, { useState, useContext, useEffect, useRef } from 'react';
import Button from './Button'
import ColorProperties from './ColorPropertyName'
import './HslModifier.css'
import './Button.css'
import { Globals } from './ColorPicker.js'

<style>
    @import url('https://fonts.googleapis.com/css2?family=Rubik+Moonrocks&family=Varela+Round&display=swap');
</style>


const HslModifier = ({ rows, columns, changeGlobalColor, hslMod, buttonLastPressed, showBorders, hoverShowColor }) => {

    const { globalHue, globalSat, globalLight } = useContext(Globals);

    const [buttonColors, setbuttonColors] = useState([]);
    const [showSolidColors, setShowSolidColors] = useState(false);
    const gradientRange = useRef(0);

    const selectedButton = useRef(Math.floor(((rows * columns) - 1) / 2));

    // const [buttonLastPressed, setButtonLastPressed] = useState([]);
    // const [deselectButton, sdeselectButton] = useState([]);

    const numGradients = rows + columns - 1;
    const colorWaveStart = Math.floor(numGradients / 2);

    let deselectButton = false;

    const getGradientColors = (gradientStart, gradientEnd) => {

        const hsl = { hue: globalHue, sat: globalSat, light: globalLight };

        switch (hslMod) {
            case ColorProperties.Hue:
                return {
                    color1: { ...hsl, hue: gradientStart },
                    color2: { ...hsl, hue: gradientEnd }
                }
            case ColorProperties.Saturation:
                return {
                    color1: { ...hsl, sat: gradientStart },
                    color2: { ...hsl, sat: gradientEnd }
                }
            case ColorProperties.Light:
                return {
                    color1: { ...hsl, light: gradientStart },
                    color2: { ...hsl, light: gradientEnd }
                }
            default:
                break;
        }
    }

    //initialization
    useEffect(() => {

        switch (hslMod) {
            case ColorProperties.Hue:
                gradientRange.current = Math.ceil(360 / (numGradients));

                break;
            case ColorProperties.Saturation:
            case ColorProperties.Light:
                gradientRange.current = Math.ceil(100 / (numGradients));
                break;
            default: break;
        }

        let gradientStart = 0;
        let gradientEnd = gradientRange.current;

        let colors = [];

        for (let i = 0; i < columns; i++) {
            let buttonsThisColor = [];

            buttonsThisColor.push(i);

            for (let j = 1; j <= i && j < rows; j++) {
                buttonsThisColor.push(i + ((columns - 1) * j));
            }

            let coloredButtons = {
                buttonsThisColor: buttonsThisColor,
                gradient: { ...getGradientColors(gradientStart, gradientEnd) },
                colorWavePosition: Math.abs(colorWaveStart - colors.length)
            };

            gradientStart += gradientRange.current;
            gradientEnd += gradientRange.current;

            colors.push(coloredButtons);
        }

        for (let i = 0, j = ((columns * 2) - 1); i < (rows - 1); i++, j += columns) {
            let buttonsThisColor = [];

            buttonsThisColor.push(j);
            for (let c = 1; c < ((rows - 1) - i) && c < columns; c++) {
                buttonsThisColor.push(j + ((columns - 1) * c));
            }

            let coloredButtons = {
                buttonsThisColor: buttonsThisColor,
                colorWavePosition: Math.abs(colorWaveStart - colors.length),
                gradient: { ...getGradientColors(gradientStart, gradientEnd) },
            };

            gradientStart += gradientRange.current;
            gradientEnd += gradientRange.current;

            colors.push(coloredButtons);
        }

        // buttonColors = [array] of objects: 
        // {
        //     buttonsThisColor: [1, 2, 3],
        //     colorWavePosition: 1,
        //     gradient: {
        //         color1: { hue: 100, sat: 100, light: 100 }
        //         color2: { hue: 100, sat: 100, light: 100 }
        //     }
        // }

        setbuttonColors(JSON.parse(JSON.stringify(colors)));

    }, []);

    useEffect(() => {
        if (buttonColors.length === 0) {
            return;
        }

        let changed = {};

        if (hslMod === ColorProperties.Hue) {
            changed = { sat: globalSat, light: globalLight };
        }
        else if (hslMod === ColorProperties.Saturation) {
            changed = { hue: globalHue, light: globalLight };
        }
        else if (hslMod === ColorProperties.Light) {
            changed = { hue: globalHue, sat: globalSat };
        }

        let colors = buttonColors.map(color => {
            let newColor1 = { ...color.gradient.color1, ...changed };
            let newColor2 = { ...color.gradient.color2, ...changed };

            return { ...color, gradient: { color1: { ...newColor1 }, color2: { ...newColor2 } } };
        });

        setbuttonColors(JSON.parse(JSON.stringify(colors)));

    }, [globalHue, globalSat, globalLight]);

    // let buttonPushDelay = 0;
    let btns = [];

    buttonColors.map(color => {
        let gradient = color.gradient;
        // let delay = (color.colorWavePosition * 100);
        let delay = (150 * (color.colorWavePosition));
        // buttonPushDelay += 150;

        return (color.buttonsThisColor.map(button => {
            // let key = `button: ${button} globalColors: [${globalHue}, ${globalSat}, ${globalLight}]`;
            btns.push(
                <Button key={button}
                    button={button}
                    hslMod={hslMod}
                    changeColor={changeGlobalColor}
                    animationDelay={delay}
                    gradient={gradient}
                    hoverShowColor={hoverShowColor}
                    showBorders={showBorders}
                />);
        }));
    });

    let btnsFragment = [];
    let fragmentStart = 0;

    buttonColors.map(color => {
        if (color.buttonsThisColor.includes(buttonLastPressed)) {
            if (hslMod === ColorProperties.Hue) {
                fragmentStart = color.gradient.color1.hue;
            }
            else if (hslMod === ColorProperties.Saturation) {
                fragmentStart = color.gradient.color1.sat;
                console.log(buttonLastPressed);
            }
            else if (hslMod === ColorProperties.Light) {
                fragmentStart = color.gradient.color1.light;
            }
        }

    });

    let solidColumns = 6;
    if (hslMod === ColorProperties.Hue) {
        solidColumns = 5;
    }

    for (let i = fragmentStart; i < (fragmentStart + gradientRange.current); i++) {
        let grad = {};
        if (hslMod === ColorProperties.Hue) {
            grad = {
                color1: { hue: i, sat: globalSat, light: globalLight },
                color2: { hue: i, sat: globalSat, light: globalLight }
            }
        }
        else if (hslMod === ColorProperties.Saturation) {
            grad = {
                color1: { hue: globalHue, sat: i, light: globalLight },
                color2: { hue: globalHue, sat: i, light: globalLight }
            }
        }
        else if (hslMod === ColorProperties.Light) {
            grad = {
                color1: { hue: globalHue, sat: globalSat, light: i },
                color2: { hue: globalHue, sat: globalSat, light: i }
            }
        }
        btnsFragment.push(
            <Button key={i}
                button={i}
                hslMod={hslMod}
                changeColor={changeGlobalColor}
                fragment={true}
                // animationDelay={delay}
                gradient={grad}
                hoverShowColor={hoverShowColor}
                showBorders={showBorders} />);
    }

    const toggleSolidColors = () => {
        setShowSolidColors((showSolidColors) => !showSolidColors);
    }

    let solidColors = '';
    let maxHeightGradient = '400px';
    let maxHeightSolid = '100px'
    let showMore = showSolidColors ? "Close" : "Show Gradient Colors";

    if (showSolidColors) {
        let maxHeight = {};
        if (hslMod === ColorProperties.Hue)
        {
            maxHeightSolid = '250px';
            maxHeightGradient = '200px';
        }

        solidColors = <div className='hsl-buttons solid-buttons'
            style={{
                '--solid-col': solidColumns,
                'maxHeight': maxHeightSolid
            }}> {btnsFragment} </div>;
            // maxHeightContainer = `300px`
    }

    let gradientColors = <div className='hsl-buttons gradient-buttons' style={{'maxHeight': maxHeightGradient}}> {btns} </div>;

    let btnShowSolid =
        <button className='btn btn-layers'
            style={{
                position: 'unset',
                padding: '5px',
                '--contrastColor': `hsl(${globalHue},${globalSat}%,${Math.abs(globalLight - 25)}%)`,
                background: `hsl(${globalHue},50%,75%)`,
            }}
            onClick={toggleSolidColors}>{showMore}</button>


    return (
        <div className='hsl-modifier'>
            {gradientColors}
            {btnShowSolid}
            {solidColors}
        </div>
    );
}

export default HslModifier;