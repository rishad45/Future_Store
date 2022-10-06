// const create_payment_json = {
//     "intent": "sale",
//     "payer": {
//         "payment_method": "paypal"
//     },
//     "redirect_urls": {
//         "return_url": "http://localhost:3000/success",
//         "cancel_url": "http://localhost:3000/cancel"
//     },
//     "transactions": [{
//         "item_list": {
//             "items": [{
//                 "name": "Redhock Bar Soap",
//                 "sku": "001",
//                 "price": "25.00",
//                 "currency": "USD",
//                 "quantity": 1
//             }]
//         },
//         "amount": {
//             "currency": "USD",
//             "total": "25.00"
//         },
//         "description": "Washing Bar soap"
//     }]
// };

// paypal.payment.create(create_payment_json, function (error, payment) {
//     if (error) {
//         throw error;
//     } else {
//         for (let i = 0; i < payment.links.length; i++) {
//             if (payment.links[i].rel === 'approval_url') {
//                 res.redirect(payment.links[i].href);
//             }
//         }
//     }
// });
