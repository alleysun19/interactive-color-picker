

import { useState, createContext, useRef } from 'react';
import HslModifier from './HslModifier';
// import Color from './Color';
import ColorProperties from './ColorPropertyName'
import './ColorPicker.css'

const Globals = createContext(null);

const ColorPicker = () => {
    const [globalHue, setHue] = useState(180);
    const [globalSat, setSat] = useState(50); //54?
    const [globalLight, setLight] = useState(50); //54?
    const [showBorders, setShowBorders] = useState(true);

    const [hoverColor, setHoverColor] = useState('');
    const columns = 5;
    const rows = 5;

    const centerButton = Math.floor(((rows * columns) - 1) / 2);
    const buttonLastPressed = useRef({
        hue: centerButton,
        sat: centerButton,
        light: centerButton
    });

    const changeHue = (hue, button = -1) => {
        if (button !== -1) {
            buttonLastPressed.current.hue = button;
        }
        setHue(hue);
    };

    const changeSat = (sat, button = -1) => {
        if (button !== -1) {
            buttonLastPressed.current.sat = button;
        }
        setSat(sat);
    };

    const changeLight = (light, button = -1) => {
        if (button !== -1) {
            buttonLastPressed.current.light = button;
        }
        setLight(light);
    };

    const hoverShowColor = (color1, color2 = undefined) => {
        if (color2 !== undefined) {
            setHoverColor(`${color1}, ${color2}`);
        }
        else {
            setHoverColor(color1);
        }
    }

    const color = `hsl(${globalHue},${globalSat}%,${globalLight}%)`

    // "Show / Hide Borders" button display setup
    const showBordersBg = `hsl(${Math.abs(globalHue - 50)}, ${globalSat}%, ${globalLight}%)`;
    let showBordersText = showBorders ? 'Hide Borders' : 'Show Borders';

    let showBordersTextContrast= 0;
    if (globalLight < 20) {
        showBordersTextContrast = 75;
    }
    else if (globalLight < 40) {
        showBordersTextContrast = 70;
    }
    else if (globalLight < 60) {
        showBordersTextContrast = 90;
    }
    else if (globalLight < 80) {
        showBordersTextContrast = 10;
    }

    const showBordersTextColor = `hsl(${Math.abs(globalHue)}, ${globalSat}%, ${showBordersTextContrast}%)`

    const setBorders = () => {
        setShowBorders((showBorders) => !showBorders);
    }

    return (
        <Globals.Provider value={{ globalHue, globalSat, globalLight }}>
            <div className='color-picker'>
                <div className='color-picked' style={
                    {
                        '--hue': globalHue,
                        '--sat': globalSat + '%',
                        '--light': globalLight + '%',
                        '--text-light': Math.abs(globalLight - 50) + '%',
                    }} >{color}</div>
                <div className='color-modifiers'>
                    <HslModifier key={1}
                        rows={rows}
                        columns={columns}
                        changeGlobalColor={changeHue}
                        hslMod={ColorProperties.Hue}
                        buttonLastPressed={buttonLastPressed.current.hue}
                        hoverShowColor={hoverShowColor}
                        showBorders={showBorders}
                    />

                    <HslModifier key={3}
                        rows={rows}
                        columns={columns}
                        changeGlobalColor={changeSat}
                        hslMod={ColorProperties.Saturation}
                        buttonLastPressed={buttonLastPressed.current.sat}
                        hoverShowColor={hoverShowColor}
                        showBorders={showBorders}
                    />

                    <HslModifier key={2}
                        rows={rows}
                        columns={columns}
                        changeGlobalColor={changeLight}
                        hslMod={ColorProperties.Light}
                        buttonLastPressed={buttonLastPressed.current.light}
                        hoverShowColor={hoverShowColor}
                        showBorders={showBorders}

                    />
                </div>
                <div className='color-picker-footer'>
                    <div style={{ height: `2em` }}>{hoverColor}</div>
                    <button className='btn btn-lg btn-layers' style={
                        {
                            position: 'unset',
                            backgroundColor: showBordersBg,
                            color: showBordersTextColor
                        }}
                        onClick={setBorders}
                    >{showBordersText}</button>
                </div>
            </div>
        </Globals.Provider>

    )

}


export { ColorPicker, Globals };
