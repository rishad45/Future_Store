const adminRepository = require("../repository/adminRepository");

module.exports = {
    findOcc: (arr, key) => {
        let arr2 = [];

        arr.forEach((x) => {

            // Checking if there is any object in arr2
            // which contains the key value
            if (arr2.some((val) => { return val[key] == x[key] })) {

                // If yes! then increase the occurrence by 1
                arr2.forEach((k) => {
                    if (k[key] === x[key]) {
                        k["occurrence"]++ 
                    }
                })

            } else {
                // If not! Then create a new object initialize 
                // it with the present iteration key's value and 
                // set the occurrence to 1
                let a = {}
                a[key] = x[key]
                a["occurrence"] = 1
                arr2.push(a);
            }
        })

        return arr2
    },
    paymentSuccessData:async()=>{
        const paymentSuccessData = await adminRepository.paymentSuccessData()
        const arr = paymentSuccessData.map((elem)=>{
            return elem.successPayment
        })
        const orderCount = await adminRepository.getOrderCounts()
        const arr2 = orderCount.map((elem)=>{
            return elem.count
        })
        let arr3=[]
        for(let i=0;i<arr2.length;i++){
            let percentage = (arr[i]/arr2[i]) * 100
            arr3.push(percentage)
        }
        return arr3
    }
}