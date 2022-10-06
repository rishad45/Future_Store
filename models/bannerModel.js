const { default: mongoose } = require("mongoose");

const bannerModel = mongoose.Schema({
    heroSliders: [String],
    categoryBanner: {
        type:[String],
        maxItems: 2
    },
    headsetBanner:[String],
    accessoryBanner:[String],
    arBanner:[String],
    cartBanner:[String],
    wishlistBanner:[String],
    accountsBanner:[String],
    advertiseBanner:[String],
    shopBanner:[String],
    blogsBanners:[String] 
},{collection: 'banners'})

const bannerManagementModel = mongoose.model('bannerManagementModel',bannerModel)
module.exports = bannerManagementModel 