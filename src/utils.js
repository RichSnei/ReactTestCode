/**
 * Created by Rich on 4/26/2017.
 */

/**************
 * Utility classes
 */
let Utils = {
    validateEmail: function(email) {
// eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },


    getStrings: function(id) {
        const myStrings = {
            SENDING_ERR_NO_SELECTED_ITEMS: "There are no valid items selected for sending.",
            SENDING_ERR_NOTHING_SELECT_INVALID_EMAILS: "There are no valid items selected for sending. <br> <span class='red'>Items in red</span> have invalid email addresses and cannot be sent until they have been fixed.",
            SENDING_ERR_INVALID_EMAIL: "<span class='red'>Items in red</span> have invalid email addresses and cannot be sent until they have been fixed.",
            DELETING_ERR_NO_SELECTED_ITEMS: "There are no items selected for deletion."
    };

        let myStr = myStrings[id];
        if (myStr.length === 0) {
            console.log("getStrings: bad id (" + id + ') passed to getStrings.')
        }
        return myStr;
     }
};

export default Utils