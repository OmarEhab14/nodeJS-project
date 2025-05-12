const showDiscount = (discount) => {
    if (discount > 0)
        return true;
    return false;
}

const calculateNewPrice = (price, discount) => {
    if(price < 0) {
        throw new Error('Price can\'t be negative')
    }
    price = (price - (price * (discount / 100))).toFixed(2);
    return price;
}

module.exports = {showDiscount, calculateNewPrice};