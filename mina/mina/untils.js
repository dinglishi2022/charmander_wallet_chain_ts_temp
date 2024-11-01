
import extension from "extensionizer";
export async function extGetLocal(key) {
    const data = await extension.storage.local.get([key]);
    return data[key]
}
export async function getCurrentNodeConfig() {
    let localNetConfig = await extGetLocal("NET_WORK_CONFIG_V2");
    if (localNetConfig) {
        return localNetConfig.currentNode;
    }
    return {};
}

/**
 * Return errors for processing transfers, etc.
 * @param {*} error
 * @returns
 */
export function getRealErrorMsg(error) {
    let errorMessage = "";
    try {
        if (error.message) {
            errorMessage = error.message;
        }
        if (Array.isArray(error) && error.length > 0) {
            // postError
            errorMessage = error[0].message;
            // buildError
            if (!errorMessage && error.length > 1) {
                errorMessage = error[1].c;
            }
        }
        if (typeof error === "string") {
            let lastErrorIndex = error.lastIndexOf("Error:");
            if (lastErrorIndex !== -1) {
                errorMessage = error.slice(lastErrorIndex);
            } else {
                errorMessage = error;
            }
        }
    } catch (error) {}
    return errorMessage;
}
