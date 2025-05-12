const formatProductTitle = (productTitle) => {
    const numberOfChars = productTitle.length;
    if(numberOfChars <= 25) {
        return productTitle;
    } else {
        var newProductTitle = productTitle.substring(0, 23)
        newProductTitle += '...'
        return newProductTitle;
    }
}

module.exports = {formatProductTitle}