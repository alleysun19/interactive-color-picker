import React, { Component } from 'react'
import Button from './Button'
import buttonGroup from './buttonGroup'
import './Keyboard.css'

class Keyboard extends Component {

    constructor() {
        super()
        this.state = {
            buttonComponents: []
            // buttonColorList: []
        };

        this.selectionType = "none"
        this.columns = 7;
        this.rows = 5;


        // this.startingHue = 0;
        this.hueIncrement = 50;
        this.saturationIncrement = 100 / (this.columns + this.rows - 1);
        this.lightIncrement = 100 / (this.columns + this.rows - 1);

        // this.incrementCount = 0;
        // this.timeDelay = 0;

        // this.timeDelayMultiplier = 3;
        this.buttonHueRange = 50;
        this.buttonLightRange = 100 / 10;
        this.buttonSaturationRange = 100 / 10;

        this.changeColorInProcess = false;
        this.buttonColorList = [];
    }

    changeColors = (quePosition, toBeQueued) => {

        let hueIncrementCount = 0;


        const incrementColor_SmoothTransition = () => {

            let push = true;
            if (hueIncrementCount === 0) {
                push = true;
            }
            if (hueIncrementCount === this.hueIncrement) {
                push = false;
            }

            setTimeout(() => {
                toBeQueued.forEach((buttonGroup) => {
                    this.buttonColorList[buttonGroup].incrementHue();
                    this.buttonColorList[buttonGroup].isPushed = push;

                    this.buttonColorList[buttonGroup].buttonsWithSameColor.forEach(button => {
                        this.state.buttonComponents[button] =
                            <Button key={button}
                                index={button}
                                colors={[this.buttonColorList[buttonGroup].hue1, this.buttonColorList[buttonGroup].hue2, this.buttonColorList[buttonGroup].saturation1, this.buttonColorList[buttonGroup].saturation2, this.buttonColorList[buttonGroup].light1, this.buttonColorList[buttonGroup].light2]}
                                colorWave={this.colorWave}
                                isPushed={this.buttonColorList[buttonGroup].isPushed} />
                    })
                })
                this.setState({ buttonComponents: this.state.buttonComponents });
            }, ((quePosition * this.hueIncrement) + hueIncrementCount) * 2.2);
            hueIncrementCount++;
        }

        while (hueIncrementCount <= this.hueIncrement) {

            incrementColor_SmoothTransition();
        }

    }


    colorWave = (button) => {

        console.log(button);
        const waveStartingIndex = this.buttonColorList.findIndex(buttonGroup => buttonGroup.buttonsWithSameColor.includes(button));

        let quePositions = [];

        for (let i = 0; i < this.buttonColorList.length; i++) {

            let quePosition = Math.abs(waveStartingIndex - i);

            let quePositionExists = quePositions.findIndex((element) => element.at(0) === quePosition);

            if (quePositionExists !== -1) {
                quePositions.at(quePositionExists).push(i);
            }
            else {
                quePositions.push([quePosition, i]);
            }

        }
        
        quePositions = quePositions.toSorted();

        quePositions.forEach(element => {
            this.changeColors(element[0], element.slice(1));
        });

    };

    componentDidMount() {

        this.selectionType = this.props.selectionType;
        this.rows = this.props.rows;
        this.columns = this.props.columns;


        let incrementColorProperty = 0;
        let hue = 0;

        let saturation = 0;

        let light = 0;

        if (this.selectionType ==="Light") {
            console.log("meow");
        }

        let buttonColorList = [];

        for (let i = 0; i < this.columns; i++) {
            let buttonsWithSameColor = [];

            buttonsWithSameColor.push(i);
            for (let j = 1; j <= i && j < this.rows; j++) {
                buttonsWithSameColor.push(i + ((this.columns - 1) * j));
            }
            let buttonColors = new buttonGroup(buttonsWithSameColor);

            console.log("huh" + incrementColorProperty);
            switch (this.selectionType) {
                case "Hue":
                    buttonColors.setHue(incrementColorProperty);
                    incrementColorProperty += buttonColors.buttonHueRange;
                break;
                case "Light":
                    buttonColors.setLight(incrementColorProperty);
                    incrementColorProperty += buttonColors.buttonLightRange;
                    if(incrementColorProperty > 100)
                    {
                        buttonColors.buttonLightRange *= -1;
                    }
                break ;
                case "Saturation":
                    buttonColors.setSaturation(incrementColorProperty);
                    incrementColorProperty += buttonColors.buttonSaturationRange;
                    if(incrementColorProperty > 100)
                    {
                        buttonColors.buttonSaturationRange *= -1;
                    }
                break;
                default:
                    break;
            }
            // incrementColorProperty += buttonColors.buttonHueRange;
            // buttonColors.setHue(hue);
            // buttonColors.setSaturation(saturation);
            // buttonColors.setLight(light);
            // hue += buttonColors.buttonHueRange;
            buttonColorList.push(buttonColors);
        }

        console.log("HUH" + incrementColorProperty);
        for (let i = 0, j = ((this.columns * 2) - 1); i < (this.rows - 1); i++, j += this.columns) {
            let buttonsWithSameColor = [];

            buttonsWithSameColor.push(j);
            for (let c = 1; c < ((this.rows - 1) - i) && c < this.columns; c++) {
                buttonsWithSameColor.push(j + ((this.columns - 1) * c));
            }

            let buttonColors = new buttonGroup(buttonsWithSameColor);
            switch (this.selectionType) {
                case "Hue":
                    buttonColors.setHue(incrementColorProperty);
                    incrementColorProperty += buttonColors.buttonHueRange;
                break;
                case "Light":
                    buttonColors.setLight(incrementColorProperty);
                    incrementColorProperty += buttonColors.buttonLightRange;
                    if(incrementColorProperty >= 100)
                    {
                        buttonColors.buttonLightRange *= -1;
                    }
                break ;
                case "Saturation":
                    buttonColors.setSaturation(incrementColorProperty);
                    incrementColorProperty += buttonColors.buttonSaturationRange;
                    if(incrementColorProperty >= 100)
                    {
                        buttonColors.buttonSaturationRange *= -1;
                    }
                break;
                default:
                    break;
            }
            // incrementColorProperty += buttonColors.buttonHueRange;
            // buttonColors.setHue(hue);
            // buttonColors.setSaturation(saturation);
            // buttonColors.setLight(light);
            // hue += buttonColors.buttonHueRange;
            buttonColorList.push(buttonColors);
        }


        let buttonColorListMiddle = buttonColorList.length / 2;
        buttonColorList.map((buttonGroup, index) => buttonGroup.numStateChangesForAnimation = buttonColorListMiddle + (Math.abs(buttonColorListMiddle - index)));


        const buttonComponents = [];
        for (let i = 0; i < (this.rows * this.columns); i++) {
            for (let buttonGroup of this.buttonColorList) {
                if (buttonGroup.buttonsWithSameColor.includes(i)) {
                    buttonComponents.push(
                        <Button key={i}
                            index={i}
                            colors={[buttonGroup.hue1, buttonGroup.hue2, buttonGroup.saturation1, buttonGroup.saturation2, buttonGroup.light1, buttonGroup.light2]}
                            colorWave={this.colorWave}
                            isPushed={buttonGroup.isPushed} />
                    );
                }
            }
        }

        this.buttonColorList = buttonColorList.map(obj => ({ ...obj }));
        this.setState({ buttonComponents: buttonComponents.map(obj => ({ ...obj })) });
        console.log(buttonComponents);


    }
    render() {

        // const buttonComponents = [];
        // for (let i = 0; i < (this.rows * this.columns); i++) {
        //     for (let buttonGroup of this.buttonColorList) {
        //         if (buttonGroup.buttonsWithSameColor.includes(i)) {
        //             buttonComponents.push(
        //                 <Button key={i}
        //                     index={i}
        //                     colors={[buttonGroup.hue1, buttonGroup.hue2, buttonGroup.saturation1, buttonGroup.saturation2, buttonGroup.light1, buttonGroup.light2]}
        //                     colorWave={this.colorWave}
        //                     isPushed={buttonGroup.isPushed} />
        //             );
        //         }
        //     }
        // }
        // this.setState({ buttonComponents: buttonComponents.map(obj => ({ ...obj })) });

        return (
            <React.Fragment>
                <div className="keyboard"
                    style={{ '--rows': this.rows, '--columns': this.columns }}>
                    {this.state.buttonComponents}
                </div>
            </React.Fragment>
        )
    }
}

export default Keyboard;
