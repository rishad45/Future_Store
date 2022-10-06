const { resolve } = require('path')
const { reject } = require('promise')

module.exports = {
    verifyPayment: data => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'SwH1rXBc8WNdtlqeEY9fwkk1')
            hmac.update(data['res[razorpay_order_id]'] + '|' + data['res[razorpay_payment_id]'])  // some data to hash
            hmac = hmac.digest('hex')
            if (hmac == data['res[razorpay_signature]']) {
                console.log("resolving...............");
                resolve()
            } else {
                console.log("rejecting................"); 
                reject()
            }
        })
    }
}