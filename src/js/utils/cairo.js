import NumberUtils from "./number.js";
import StringUtils from "./string.js";

export class Uint256 {
    constructor(low, high) {
        this.low = low;
        this.high = high;
    }

    toFeltArray() {
        return [this.low, this.high];
    }
    
    toBN() {
        return NumberUtils.toBN(this.high).shln(128).add(NumberUtils.toBN(this.low));
    }
}

export default {

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
        return NumberUtils.toBN(bn).lte(NumberUtils.toBN(1).shln(256).sub(NumberUtils.toBN(1)));
    },

    feltArrayToUint256(feltArr) {
        return new Uint256(BigInt(feltArr[0]).toString(16), BigInt(feltArr[1]).toString(16));
    },

    bnToUint256(bn) {
        if (!this.isUint256(bn)) {
            throw new Error("Number is too large");
        }

        bn = NumberUtils.toBN(bn);
        return new Uint256(BigInt(StringUtils.addHexPrefix(bn.maskn(128).toString(16))), BigInt(StringUtils.addHexPrefix(bn.shrn(128).toString(16))));
    },

    uint256ToBN(uint256) {
        return NumberUtils.toBN(uint256.high).shln(128).add(NumberUtils.toBN(uint256.low));
    }
}
