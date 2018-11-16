module.exports = class Assert {
    static True(value, message) {
        if(!value) {
            let fail_msg = "Assert failed. Expected: true; Actual: false ";
            if(message) {
                fail_msg += message;
            }
            console.log(fail_msg);
            return false;
        }
        return true;
    }

    static False(value, message) {
        if(value) {
            let fail_msg = "Assert failed. Expected: false; Actual: true ";
            if(message) {
                fail_msg += message;
            }
            console.log(fail_msg);
            return false;
        }
        return true;
    }

    static Equal(value, value2, message) {
        if(value !== value2) {
            let fail_msg = "Assert failed. Expected: " + value + "; Actual: " + value2;
            if(message) {
                fail_msg += message;
            }
            console.log(fail_msg);
            return false;
        }
        return true;
    }
};