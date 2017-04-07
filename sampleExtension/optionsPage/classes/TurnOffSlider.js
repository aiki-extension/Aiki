
function TurnOffSlider(sliderID) {
    var self = this;
    this.selectedTime = 10;
    this.slider = new GreenToRedSlider(sliderID, function(value) { self.selectedTime = parseInt(value); });
    this.offButton = $(this.slider.sliderDiv.find(sliderID + "-offBtn"));

    this.toggleShowOffMessage = function() {
        var sl = self.slider;
        if (settings_object.getState() == "Off") {
            sl.sliderValue.html(self.createHtmlOffMessage());
            sl.sliderValue.parent().removeClass('col-md-3').addClass('col-md-10');
            sl.sliderRange.css('visibility', 'hidden').css('display', 'none');
        } else {
            sl.sliderValue.html(sl.calculateHours(self.selectedTime));
            sl.sliderValue.parent().removeClass('col-md-10').addClass('col-md-3');
            sl.sliderRange.css('visibility', 'visible').css('display', 'initial');
        }
    };

    this.createHtmlOffMessage = function() {
        return "Turned off until: " + this.formatDate(settings_object.getOffTill());
    };

    this.formatDate = function(date) {
        var arr = date.toString().split(" ");
        return arr.splice(0, 5).join(" ");
    };

    this.setSliderHourFunc = function() {
        this.slider.calculateHours = function(val) {
            var hours = Math.floor(val / 60);
            var minutes = val % 60;
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            var returnVal = "for " + hours + ":" + minutes + " hours.";
            if (val == MAX_TURN_OFF_TIME) {
                returnVal = "for the rest of the day";
            }
            return returnVal;
        };
    };

    this.turnOff = function() {
        if (settings_object.getState() == "On") {
            if (self.selectedTime == MAX_TURN_OFF_TIME) {
                settings_object.turnOffForDay();
            } else {
                settings_object.turnOffFor(self.selectedTime);
            }
        } else {
            settings_object.turnOn();
        }
        self.toggleShowOffMessage();
        self.offButton.text("Turn " + settings_object.getNotState());
    };

    this.init = function () {
        var sl = this.slider;
        sl.sliderRange[0].max = MAX_TURN_OFF_TIME;
        this.setSliderHourFunc();
        sl.sliderValue.html(sl.calculateHours(sl.sliderRange.val()));
        this.toggleShowOffMessage();
        this.offButton.text("Turn " + settings_object.getNotState());
        connectButton(this.offButton, this.turnOff);
    };

    this.init();
}
