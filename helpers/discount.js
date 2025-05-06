const showDiscount = (discount) => {
    if (discount > 0)
        return true;
    return false;
}

const calculateNewPrice = (price, discount) => {
    price = (price - (price * (discount / 100))).toFixed(2);
    return price;
}

module.exports = {showDiscount, calculateNewPrice};