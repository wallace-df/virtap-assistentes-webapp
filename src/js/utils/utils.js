import Web3Utils from "web3-utils";

export class Uint256 {
    constructor(low, high) {
        this.low = low;
        this.high = high;
    }

    toFeltArray() {
        return [this.low, this.high];
    }
    
    toBN() {
        return new Web3Utils.BN(this.high).shln(128).add(new Web3Utils.BN(this.low));
    }
}

export default {

    isString(s) {
        return (typeof s === "string" || s instanceof String)
    },

    isEmpty(str) {
        return (str === undefined || str === null || !this.isString(str) || str.trim().length === 0);
    },

    isValidAddress(address) {
        return Web3Utils.isAddress(address);
    },

    isValidAmount(amount, minValue, maxValue) {
        if (!this.isString(amount) || this.isEmpty(amount)) {
            return false;
        }

        const regexStr = "^(0|[1-9]\\d*)(\\.\\d{0," + 18 + "})?$";

        if (new RegExp(regexStr).test(amount) === false) {
            console.log("invalid number");
            return false;
        }

        if (!this.isEmpty(minValue)) {
            try {
                minValue = this.toBN(minValue);
            } catch (err) {
                minValue = null;
            }
        }


        if (!this.isEmpty(maxValue)) {
            try {
                maxValue = this.toBN(maxValue);
            } catch (err) {
                maxValue = null;
            }
        }

        try {
            let value = this.toBN(amount);
            if (minValue && value.lt(minValue)) {
                throw "Value should be >= " + minValue.toString();
            }
            if (maxValue && value.le(maxValue)) {
                throw "Value should be <= " + maxValue.toString();
            }
        } catch (err) {
            console.log(err);
            return false;
        }

        return true;
    },

    toBaseUnit(value, decimals) {
        if (!this.isString(value)) {
            throw new Error("Pass strings to prevent floating point precision issues.");
        }

        const regexStr = "^(0|[1-9]\\d*)(\\.\\d{0," + decimals + "})?$";

        if (new RegExp(regexStr).test(value) === false) {
            throw new Error("INVALID_NUMBER")
        }

        const BN = Web3Utils.BN;
        const ten = new BN(10);
        const base = ten.pow(new BN(decimals));

        // Is it negative?
        let negative = (value.substring(0, 1) === "-");
        if (negative) {
            value = value.substring(1);
        }

        if (value === ".") {
            throw new Error(
                `Invalid value ${value} cannot be converted to`
                + ` base unit with ${decimals} decimals.`);
        }

        // Split it into a whole and fractional part
        let comps = value.split(".");
        if (comps.length > 2) { throw new Error("Too many decimal points"); }

        let whole = comps[0], fraction = comps[1];

        if (!whole) { whole = "0"; }
        if (!fraction) { fraction = "0"; }
        if (fraction.length > decimals) {
            throw new Error("Too many decimal places");
        }

        while (fraction.length < decimals) {
            fraction += "0";
        }

        whole = new BN(whole);
        fraction = new BN(fraction);
        let wei = (whole.mul(base)).add(fraction);

        if (negative) {
            wei = wei.neg();
        }

        return new BN(wei.toString(10), 10);
    },

    toBN(value) {
        return new Web3Utils.BN(value);
    },

    exp(base, exp) {
        return this.toBN(base).pow(this.toBN(exp));
    },

    formatUnit(value, decimals) {
        value = this.toBN(value);
        let base = new Web3Utils.BN(10).pow(new Web3Utils.BN(decimals));
        let fraction = value.mod(base).toString(10);

        while (fraction.length < decimals) {
            fraction = `0${fraction}`;
        }

        fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];

        let whole = value.div(base).toString(10);
        value = `${whole}.${fraction}`;

        let paddingZeroes = decimals - fraction.length;
        while (paddingZeroes > 0) {
            paddingZeroes--;
            value = `${value}0`;
        }
        return value;
    },

    readFileAsBlob(file, callback) {
        let fileReader = new FileReader();

        fileReader.onload = function () {
            callback(null, fileReader.result);
        };

        fileReader.onerror = function (err) {
            callback(err, null);
        };

        fileReader.readAsArrayBuffer(file);
    },

    readFileAsText(file, callback) {
        let fileReader = new FileReader();

        fileReader.onload = function () {
            callback(null, fileReader.result);
        };

        fileReader.onerror = function (err) {
            callback(err, null);
        };

        fileReader.readAsText(file);
    },

    readFileAsJson(file, callback) {
        this.readFileAsText(file, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }

            try {
                callback(null, JSON.parse(result));
            } catch (error) {
                callback(error, null);
            }
        });
    },

    toIPFSGatewayLink(ipfsLink) {
        if (this.isEmpty(ipfsLink) || ipfsLink.indexOf("ipfs://") !== 0) {
            throw "Invalid link: " + ipfsLink;
        }

        let cid = ipfsLink.replace("ipfs://", "");
        let slashPos = cid.indexOf("/");
        let path = "";
        if (slashPos >= 0) {
            path = cid.substring(slashPos);
            cid = cid.substring(0, slashPos);
        }

        return "https://" + cid + ".ipfs.nftstorage.link" + path;
    },

    toBigInt(value) {
      return BigInt(value)
    },

    strToFelt(str) {
        const substr = str.split("");
        const ss = substr.reduce(
            (memo, c) => memo + c.charCodeAt(0).toString(16),
            ""
        );
        return BigInt("0x" + ss)
    },

    strToFeltArr(str) {
        const size = Math.ceil(str.length / 31);
        const arr = Array(size);

        let offset = 0;
        for (let i = 0; i < size; i++) {
            arr[i] = this.strToFelt(str.substring(offset, offset + 31));
            offset += 31;
        }

        return arr;
    },

    feltArrToStr(felts) {
        return felts.reduce(
            (memo, felt) => memo + Buffer.from(felt.toString(16), "hex").toString(),
            ""
        );
    },

    isUint256(bn) {
        return this.toBN(bn).lte(this.toBN(1).shln(256).sub(this.toBN(1)));
    },

    removeHexPrefix(hex) {
        return hex.replace(/^0x/, "");
    },

    addHexPrefix(hex) {
        return `0x${this.removeHexPrefix(hex)}`;
    },

    toHex(bn) {
        return this.addHexPrefix(bn.toString("hex"));
    },

    feltArrayToUint256(feltArr) {
        return new Uint256(BigInt(feltArr[0]).toString(16), BigInt(feltArr[1]).toString(16));
    },

    bnToUint256(bn) {
        if (!this.isUint256(bn)) {
            throw new Error("Number is too large");
        }

        bn = this.toBN(bn);
        return new Uint256(BigInt(this.addHexPrefix(bn.maskn(128).toString(16))), BigInt(this.addHexPrefix(bn.shrn(128).toString(16))));
    },

    uint256ToBN(uint256) {
        return this.toBN(uint256.high).shln(128).add(this.toBN(uint256.low));
    }
}
