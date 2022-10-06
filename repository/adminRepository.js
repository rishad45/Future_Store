const { default: mongoose } = require("mongoose");
const bannerManagementModel = require("../models/bannerModel");
const orderModel = require("../models/orderModel");
const { productModel, CategoriesModel } = require("../models/productSchema");
module.exports = {
    // getOrders: async () => {
    //     return await orderModel.aggregate([
    //         {
    //             $project: {
    //                 userId: 1,
    //                 paymentMethod: 1,
    //                 orderStatus: 1,
    //                 paymentStatus: 1,
    //                 GrandTotal: 1,
    //                 createdAt: 1,
    //                 products: 1,
    //             },
    //         },
    //         {
    //             $lookup: {
    //                 from: "productmodels",
    //                 localField: "products.productId",
    //                 foreignField: "_id",
    //                 as: "orderedProducts",
    //             },
    //         },
    //     ]);
    // },
    getOrders: async () => {
        return await orderModel.aggregate(
            [
                {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$lookup': {
                        'from': 'productmodels',
                        'localField': 'products.productId',
                        'foreignField': '_id',
                        'as': 'orderedProducts'
                    }
                }, {
                    '$lookup': {
                        'from': 'usermodels',
                        'localField': 'userId',
                        'foreignField': '_id',
                        'as': 'user'
                    }
                },
                {
                    '$project': {
                        'products': 1,
                        'paymentMethod': 1,
                        'paymentStatus': 1,
                        'GrandTotal': 1,
                        'orderedProducts': 1,
                        'createdAt': 1,
                        'updatedAt': 1,
                        'user': 1
                    }
                }, {
                    '$sort': { 'createdAt': -1 }
                }
            ]
        )
    },
    getSalesOrders: async () => {
        return await orderModel.aggregate(
            [
                {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$match': {
                        'paymentStatus': 'fulfilled',
                        'products.orderStatus': { '$ne': 'canceled' }
                    }
                }, {
                    '$lookup': {
                        'from': 'productmodels',
                        'localField': 'products.productId',
                        'foreignField': '_id',
                        'as': 'orderedProducts'
                    }
                }, {
                    '$lookup': {
                        'from': 'usermodels',
                        'localField': 'userId',
                        'foreignField': '_id',
                        'as': 'user'
                    }
                },
                {
                    '$project': {
                        'products': 1,
                        'paymentMethod': 1,
                        'paymentStatus': 1,
                        'GrandTotal': 1,
                        'orderedProducts': 1,
                        'createdAt': 1,
                        'updatedAt': 1,
                        'user': 1
                    }
                }, {
                    '$sort': { 'createdAt': -1 }
                }
            ]
        )
    },

    getOrderStatus: async () => {
        return await orderModel.find({}, { orderStatus: 1 });
    },

    // get order by id
    // getOrderById: async (id) => {
    //     return await orderModel.aggregate(
    //         [
    //             {
    //                 '$match': {
    //                     '_id': mongoose.Types.ObjectId(id)
    //                 }
    //             },
    //             {
    //                 '$lookup': {
    //                     'from': 'productmodels',
    //                     'localField': 'products.productId',
    //                     'foreignField': '_id',
    //                     'as': 'orderedProducts'
    //                 }
    //             },
    //             {
    //                 '$lookup': {
    //                     'from': 'usermodels',
    //                     'localField':'userAddress',
    //                     'foreignField':'address._id',
    //                     'as': 'deliveryAddress'
    //                 }
    //             },
    //             {
    //                 '$project': {
    //                     'userId': 1,
    //                     'orderStatus': 1,
    //                     'paymentStatus': 1,
    //                     'GrandTotal': 1,
    //                     'createdAt': 1,
    //                     'orderedProducts': 1,
    //                     'deliveryAddress': 1,
    //                     'products':1
    //                 }
    //             }

    //         ]
    //     ).exec()

    // }
    getOrderById: async (id, productId) => {
        console.log(id);
        console.log(productId);
        return await orderModel.aggregate(
            [
                {
                    '$match': {
                        '_id': mongoose.Types.ObjectId(id)
                    }
                }, {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$match': {
                        'products.productId': mongoose.Types.ObjectId(productId)
                    }
                }, {
                    '$lookup': {
                        'from': 'productmodels',
                        'localField': 'products.productId',
                        'foreignField': '_id',
                        'as': 'productDetail'
                    }
                }, {
                    '$lookup': {
                        'from': 'usermodels',
                        'localField': 'userAddress',
                        'foreignField': 'address._id',
                        'as': 'orderedAddress'
                    }
                }


            ]
        );
    },
    // change order status by orderId
    changeStatus: async (data) => {
        const orderId = mongoose.Types.ObjectId(data.orderId);
        const productId = mongoose.Types.ObjectId(data.productId);
        console.log(orderId);
        console.log(productId);
        console.log("here");
        try {
            if (data.payStatus != "") {
                return await orderModel.updateOne(
                    { $and: [{ _id: orderId }, { "products.productId": productId }] },
                    {
                        $set: {
                            "products.$.orderStatus": data.status,
                            paymentStatus: data.payStatus,
                        },
                    }
                );
            } else {
                return await orderModel.updateOne(
                    { $and: [{ _id: orderId }, { "products.productId": productId }] },
                    { $set: { "products.$.orderStatus": data.status } }
                );
            }
        } catch (err) {
            console.error(err);
        }
    },

    getAllCategories: async () => {
        return await CategoriesModel.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $lookup: {
                    from: "subcategorymodels",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subCategories",
                },
            },
        ]).exec();
    },

    // ...................  D A S H B O A R D ..................
    ordersOnProcessing: async () => {
        const ordersOnProcessing = await orderModel.aggregate(
            [
                {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$match': {
                        'products.orderStatus': {
                            '$nin': [
                                'delivered', 'canceled'
                            ]
                        }
                    }
                }, {
                    '$count': 'total'
                }
            ]
        )
        return ordersOnProcessing
    },
    // orders on hold
    ordersOnHold: async () => {
        const ordersOnHold = await orderModel.aggregate(
            [
                {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$match': {
                        'products.orderStatus': {
                            '$in': [
                                'placed'
                            ]
                        }
                    }
                }, {
                    '$count': 'total'
                }
            ]
        )
        return ordersOnHold
    },
    getSales: async () => {
        const sales = await orderModel.aggregate(
            [
                {
                    '$group': {
                        '_id': {
                            'day': {
                                '$dayOfMonth': '$updatedAt'
                            },
                            'month': {
                                '$month': '$updatedAt'
                            },
                            'year': {
                                '$year': '$updatedAt'
                            }
                        },
                        'profit': {
                            '$sum': '$GrandTotal'
                        }
                    }
                }, {
                    '$sort': {
                        '_id.year': -1,
                        '_id.month': -1,
                        '_id.day': -1
                    }
                }, {
                    '$limit': 7
                }
            ]
        );
        return sales
    },
    getOrderCounts: async () => {
        const orderCounts = await orderModel.aggregate([
            {
                $group: {
                    _id: {
                        day: {
                            $dayOfMonth: "$updatedAt",
                        },
                        month: {
                            $month: "$updatedAt",
                        },
                        year: {
                            $year: "$updatedAt",
                        },
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                '$sort': {
                    '_id.year': -1,
                    '_id.month': -1,
                    '_id.day': -1
                }
            }, {
                '$limit': 7
            }
        ]);
        return orderCounts
    },

    // get COD VS ONLINE CHART
    codVsOnline: async () => {
        const codVsOnline = await orderModel.aggregate(
            [

                {
                    '$group': {
                        '_id': null,
                        'countCOD': {
                            '$sum': {
                                '$cond': [
                                    {
                                        '$eq': [
                                            '$paymentMethod', 'COD'
                                        ]
                                    }, 1, 0
                                ]
                            }
                        },
                        'countRazor': {
                            '$sum': {
                                '$cond': [
                                    {
                                        '$eq': [
                                            '$paymentMethod', 'RAZOR'
                                        ]
                                    }, 1, 0
                                ]
                            }
                        }
                    }
                }

            ]
        );

        return codVsOnline
    },

    // payment successful or not
    paymentSuccessData: async () => {
        const paymentSuccessData = await orderModel.aggregate(
            [
                {
                    '$group': {
                        '_id': {
                            'day': {
                                '$dayOfMonth': '$updatedAt'
                            },
                            'month': {
                                '$month': '$updatedAt'
                            }
                        },
                        'successPayment': {
                            '$sum': {
                                '$cond': [
                                    {
                                        '$eq': [
                                            '$paymentStatus', 'fulfilled'
                                        ]
                                    }, 1, 0
                                ]
                            }
                        }
                    }
                }, {
                    '$sort': {
                        '_id.month': -1,
                        '_id.day': -1
                    }
                }, {
                    '$limit': 7
                }
            ]
        )
        return paymentSuccessData
    },

    updateBanners: async (img) => {
        await bannerManagementModel.updateOne({}, { $set: { heroSliders: img } }, { upsert: true }).then((res) => {
            console.log(res);
        })
    },
    updatePrimaryBanners: async (img) => {
        await bannerManagementModel.updateOne({}, { $set: { categoryBanner: img } }, { upsert: true }).then((res) => {
            console.log(res)
        })
    },
    updateSecondaryBanners: async (img) => {
        try {
            await bannerManagementModel.updateOne({}, { $set: { shopBanner: img } }, { upsert: true }).then((res) => {
                console.log((res));
            })
        } catch (err) {
            return err
        }
    }

};
