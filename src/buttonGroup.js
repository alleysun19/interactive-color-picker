class buttonGroup {
    constructor(buttonsWithSameColor) {
        this.buttonsWithSameColor = buttonsWithSameColor;

        this.hue1 = 0;
        this.hue2 = 0;

        this.saturation1 = 60;
        this.saturation2 = 60;

        this.light1 = 70;
        this.light2 = 70;

        this.numStateChangesForAnimation = 0;

        this.isPushed = false;

        this.buttonHueRange = 50;
        this.buttonLightRange = 100 / 5;
        this.buttonSaturationRange = 100 / 5;
    }

    setHue = function(hue) {
        this.hue1 = hue;
        this.hue2 = hue + this.buttonHueRange;
    }

    setSaturation = function(saturation) {
        this.saturation1 = saturation;
        this.saturation2 = saturation + this.buttonSaturationRange;
    }

    setLight = function(light) {
        this.light1 = light;
        this.light2 = light + this.buttonLightRange;
    }

    // incrementHue = () => {
    //     this.hue1++;
    //     this.hue2++;
    // }

    incrementHue = function() {
        this.hue1++;
        this.hue2++;
    }

}

export default buttonGroup;