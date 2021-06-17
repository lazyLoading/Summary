//验证数字
function goodsPriceCheck(rule, value, callback) {
    if (value) {
        if (isNaN(value)) {
            callback(new Error('请输入数字'))
        } else {
            if (value[0] === '0' && value[1] !== '.') {
                callback(new Error('请输入正确的数字'))
            } else {
                callback()
            }
        }
    } else {
        callback()
    }
}

//验证保留两位小数
function testTwoSmallNum(rule, value, callback) {
    let reg = /^(([1-9]{1}\d{0,7})|(0{1}))(\.\d{1,2})?$/
    if (value) {
        if (reg.test(Number(value))) {
            callback()
        } else {
            callback(new Error('最多保留两位小数'))
        }
    } else {
        callback()
    }
}


export { goodsPriceCheck, testTwoSmallNum }