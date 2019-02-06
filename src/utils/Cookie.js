/**
 * Utility class to work with browser cookies
 */
class Cookie {
    /**
     * Method returns value of cookie
     * @param name: Name of cookie
     * @param callback: Function which is called after operation finished
     * @returns String value of cookie
     */
    get(name,callback) {
        if (!callback) callback = () => null;
        if (document) {
            const result = document.cookie.match(new RegExp("(^|;) ?" + name + "=([^;]*)(;|$)"));
            callback(result ? result[2] : null);
        } else {
            return callback();
        }
    }

    /**
     * Method to set cookie
     * @param name: Name of cookie
     * @param value: Value of cookie
     * @param callback: Function which is called after operation finished
     */
    set(name,value,callback) {
        if (!callback) callback = () => null;
        const d = new Date();
        d.setTime(d.getTime() + 24*60*60*1000*365);
        if (document) {
            document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString();
        }
        callback();
    }

    /**
     * Method to delete cookie
     * @param name: Name of cookie
     * @param callback: Function which is called after operation finished
     */
    delete(name,callback) {
        if (!callback) callback = () => null;
        const d = new Date();
        d.setTime(d.getTime() + 24*60*60*1000*-1);
        document.cookie = name + "=;path=/;expires=" + d.toUTCString();
        callback();
    }

}

export default new Cookie();