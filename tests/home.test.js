const {formatProductTitle} = require('../helpers/home')
describe('home functions test', () => {
    it('should return "JACK & JONES TShirt" if it was less than or equal to 25 chars', () => {
        expect(formatProductTitle('JACK & JONES TShirt')).toBe("JACK & JONES TShirt");
    }),
    it('should return "Man Comfort Fit Crew Ne..." when the product title is greater than 25 chars', () => {
        expect(formatProductTitle('Man Comfort Fit Crew Neck Short Sleeve Knitted T-Shirt')).toBe('Man Comfort Fit Crew Ne...');
    })
})