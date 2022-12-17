
import StringUtils from "./string.js";


export default {

    toIPFSGatewayLink(ipfsLink) {
        if (StringUtils.isEmpty(ipfsLink) || ipfsLink.indexOf("ipfs://") !== 0) {
            return "";
        }

        let cid = ipfsLink.replace("ipfs://", "");
        let slashPos = cid.indexOf("/");
        let path = "";
        if (slashPos >= 0) {
            path = cid.substring(slashPos);
            cid = cid.substring(0, slashPos);
        }

        return "https://" + cid + ".ipfs.nftstorage.link" + path;
    }
}
