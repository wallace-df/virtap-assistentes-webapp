import NumberUtils from "../utils/number.js";
import TimeUtils from "../utils/time.js";

const $ = window["$"];

export default {
    methods: {
        formatPrice(price) {
            if (!price) {
                return "-";
            }

            let formattedPrice = NumberUtils.formatUnit(price.toString(), 18);
            return formattedPrice.substring(0, formattedPrice.length - 10) + " ETH";
        },

        formatDuration(loanDurationInSeconds) {
            return TimeUtils.formatDuration(loanDurationInSeconds);
        },

        formatTimestamp(timestamp) {
            return TimeUtils.formatTimestamp(timestamp);
        },

        formatAnnualizedReturn(loanAmount, loanInterest, loanDurationInSeconds) {
            if (!loanAmount || !loanInterest || !loanDurationInSeconds) {
                return "-";
            }

            loanAmount = Number(loanAmount);
            loanInterest = Number(loanInterest);
            loanDurationInSeconds = Number(loanDurationInSeconds);

            let loanDays = loanDurationInSeconds / (24 * 3600);
            let totalReturn = (loanAmount + loanInterest) / loanAmount;
            let arr = Math.pow(totalReturn, (365 / loanDays)) - 1;

            return parseFloat(arr * 100).toFixed(4) + "%";
        },


        formatTotalAmount(loan) {
            if (!loan || !loan.amount || !loan.interest) {
                return "-";
            }

            return this.formatPrice(BigInt(loan.amount) + BigInt(loan.interest));
        },

        showError(err) {
            console.log(err);
            let error;
            if (err.data && err.data.data && err.data.data.message) {
                error = err.data.data.message;
            } else if (err.message) {
                error = err.message;
            } else {
                error = err;
            }

            this.$store.commit("setLoading", false);

            $("#errorMsg").text(error);
            $("#errorModal").modal("show");

        },

        showSuccess(msg) {
            $("#successMsg").text(msg);
            $("#successModal").modal("show");
        }
    }
}