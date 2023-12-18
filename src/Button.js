import React, { useContext, useEffect, useRef, useState } from 'react'
import './Button.css'
import ColorProperties from './ColorPropertyName'
import { Globals } from './ColorPicker.js'

const Button = ({
    button, hslMod, changeColor, animationDelay, hoverShowColor, showBorders, fragment = false,
    gradient: {
        color1: { hue: hue1, sat: sat1, light: light1 },
        color2: { hue: hue2, sat: sat2, light: light2 } } }) => {

    const background = useRef(``);

    // const lightContrast = useRef();

    // let buttonPressed = false;

    const copyColor = (e) => {
        e.preventDefault();
        console.log(`copy: (${hue1}, ${sat1}, ${light1})`);
    }
    const setGlobalColor = () => {

        console.log(JSON.stringify(`start: (${hue1}, ${sat1}, ${light1})`));
        console.log(JSON.stringify(`end: (${hue2}, ${sat2}, ${light2})`));

        let gradientAvg = 0;

        switch (hslMod) {
            case ColorProperties.Hue:
                gradientAvg = (hue1 + hue2) / 2;
                break;
            case ColorProperties.Saturation:
                gradientAvg = (sat1 + sat2) / 2;
                break;
            case ColorProperties.Light:
                gradientAvg = (light1 + light2) / 2;
                break;
            default:
                break;
        }

        if (!fragment) {
            changeColor(gradientAvg, button);
        }
        else {
            console.log(gradientAvg);
            changeColor(gradientAvg);
        }

    }

    // useEffect(() => {
    //     let ele = document.getElementById('no_right_click');
    //     ele.addEventListener('contextmenu', (ev)=>{
    //       console.log("Right click disabled");
    //       ev.preventDefault(); // this will prevent browser default behavior 
    //     });
    // }, []);

    background.prev = background.current;


    background.current =
        `linear-gradient(to bottom right, ` +
        `hsl(${hue1}, ${sat1}%, ${light1}%), ` +
        `hsl(${hue2}, ${sat2}%, ${light2}%))`

    let contrast = Math.abs(((light1 + light2) / 2) - 25);

    let borderColor = '';
    if (showBorders) {
        console.log("meow");
        borderColor = `hsl(${hue1},${sat1}%,${contrast}%)`
    }

    // if (hslMod === ColorProperties.Light) {
    //     contrast = Math.abs(gradientAvg - 50);
    // }

    const onHover = () => {
        // if (fragment) {
            hoverShowColor(`hsl(${hue1},${sat1}%,${light1}%)`);
        // }
    }

    const clearHover = () => {
        // if (fragment) {
            hoverShowColor(``);
        // }
    }
    return (
        <div className='btn-layers'
            key={JSON.stringify(background.current)}
            style={{
                order: button,
                animationDelay: `${animationDelay}ms`,
            }}
            onMouseEnter={ onHover }>

            <div className={`btn`}
                style={{
                    backgroundImage: background.prev,
                    '--contrastColor': borderColor,
                }}>
            </div>

            <div className='btn btn-animate'
                style={{
                    backgroundImage: background.current,
                    animationDelay: `${animationDelay}ms`,
                    // '--contrastColor': `hsl(0,0%,${lightContrast.current}%`,

                }}
                onClick={() => setGlobalColor()}
                onContextMenu={copyColor}
                onMouseEnter={ onHover }
                onMouseLeave={ clearHover }
                >
            </div>

        </div>
    );

}




export default Button;