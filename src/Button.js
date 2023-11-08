import React, { Component } from 'react'
import './Button.css'

// const Button = ({ colors: [color1, color2] }) => {
class Button extends Component {
    constructor(props) {
        super(props)

        this.hue1 = 0;
        this.hue2 = 0;
        this.saturation1 = 0;
        this.saturation2 = 0;
        this.light1 = 0;
        this.light2 = 0;
        this.isPushed = false;

        this.hoverEffect = {
            backgroundImage: `linear-gradient(to bottom right, hsl(${this.hue1}, ${this.saturation1}%, ${this.light1}%), hsl(${this.hue2}, ${this.saturation2}%, ${this.light2}%))`,
            '--hue1': this.hue1, '--hue2': this.hue2
            // transform: 'translateX(5px) translateY(5px)',
            // boShadow: '4px 4px 0 4px rgb(27, 10, 182)',
            // border: 'solid 2px rgb(27, 10, 182);',
        };

        this.getHoverEffect = () => {

            // console.log();
            if (this.isPushed){
                return({
                    backgroundImage: `linear-gradient(to bottom right, hsl(${this.hue1}, ${this.saturation1}%, ${this.light1}%), hsl(${this.hue2}, ${this.saturation2}%, ${this.light2}%))`,
                    '--hue1': this.hue1, '--hue2': this.hue2,
                    transform: `translateX(12px) translateY(12px)`,
                    border: `solid 3px rgb(27, 10, 182)`,
                    boxShadow: `none`
                    // transform: 'translateX(5px) translateY(5px)',
                    // boShadow: '4px 4px 0 4px rgb(27, 10, 182)',
                    // border: 'solid 2px rgb(27, 10, 182);',
                });
            }
            else {
                return({
                    backgroundImage: `linear-gradient(to bottom right, hsl(${this.hue1}, ${this.saturation1}%, ${this.light1}%), hsl(${this.hue2}, ${this.saturation2}%, ${this.light2}%))`,
                    '--hue1': this.hue1, '--hue2': this.hue2,


                    // transform: 'translateX(5px) translateY(5px)',
                    // boxShadow: '4px 4px 0 4px rgb(27, 10, 182)',
                    // border: 'solid 2px rgb(27, 10, 182);'
                });
            }
        }
    }



    triggerColorWave = (index) => {
        this.props.colorWave(index);
        console.log(`${this.hue1} ${this.hue2} ${this.saturation1} ${this.saturation2} ${this.light1} ${this.light2}`);
    };

    render() {
        [this.hue1, this.hue2, this.saturation1, this.saturation2, this.light1, this.light2] = this.props.colors;
        const index = this.props.index;
        this.isPushed = this.props.isPushed;

        return (
            <div
                className={`btn`}
                style={
                    this.getHoverEffect()
                }
                // style={{ '--hue1': hue1 , '--hue2': hue2}}
                onClick={() => this.triggerColorWave(index)}>
            </div>
        );
    }
}

export default Button;