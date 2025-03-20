sap.ui.define([], function () {
    "use strict";
    return {
		firstScale(sectionLikertScale) {
			switch (sectionLikertScale) {
				case "Satisfaction":
					return "Very Dissatisfied";
				case "Frequency":
					return "Never";
				case "Agreement":
					return "Strongly Disagree";
                case "Quality":
                    return "Very Poor"
			}
		},

        secondScale(sectionLikertScale) {
			switch (sectionLikertScale) {
				case "Satisfaction":
					return "Dissatisfied";
				case "Frequency":
					return "Rarely";
				case "Agreement":
					return "Disagree";
                case "Quality":
                    return "Poor"
			}
		},

        thirdScale(sectionLikertScale) {
			switch (sectionLikertScale) {
				case "Satisfaction":
					return "Neutral";
				case "Frequency":
					return "Sometimes";
				case "Agreement":
					return "Neutral";
                case "Quality":
                    return "Average"
			}
		},

        fourthScale(sectionLikertScale) {
			switch (sectionLikertScale) {
				case "Satisfaction":
					return "Satisfied";
				case "Frequency":
					return "Often";
				case "Agreement":
					return "Agree";
                case "Quality":
                    return "Good"
			}
		},

        fifthScale(sectionLikertScale) {
			switch (sectionLikertScale) {
				case "Satisfaction":
					return "Very Satisfied";
				case "Frequency":
					return "Always";
				case "Agreement":
					return "Strongly Agree";
                case "Quality":
                    return "Excellent"
			}
		}
	};
});
