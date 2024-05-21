// Function to convert different units to milliliters
function convertToMilliliters(value, unit) {
    switch(unit.toLowerCase()) {
        case 'fl oz':
        case 'fl. oz':
            return value * 29.5735;
        case 'oz':
            return value * 29.5735; // Assuming liquid ounces
        case 'ml':
            return value;
        case 'l':
            return value * 1000;
        default:
            console.warn(`Unrecognized unit: ${unit}`);
            return null; // Return null if the unit is unrecognized
    }
}

// Helper function to parse price and unit from the HTML
function parsePriceAndUnit(element) {
    console.log('Parsing price and unit from element:', element);
    let priceText = element.querySelector('.a-offscreen').textContent.replace(/[^0-9.]/g, '');
    let match = element.textContent.match(/\/([a-zA-Z\s.]+)/);
    console.log(priceText, match);
    if (!match) {
        console.warn('No unit match found in element:', element);
        return null;
    }
    let unitText = match[1].trim();
    return {
        price: parseFloat(priceText),
        unit: unitText
    };
}

// Collect all price per unit elements
var pricePerUnitElements = document.querySelectorAll('[class*="a-price a-text-price"]');

// Collect items with their respective parent containers and price per unit details
var items = [];

pricePerUnitElements.forEach(el => {
    let parentContainer = el.closest('[data-component-type="s-search-result"]');
    if (parentContainer) {
        let priceAndUnitParent = el.closest('.a-size-base.a-color-secondary');
        if (priceAndUnitParent) {
            let priceAndUnit = parsePriceAndUnit(priceAndUnitParent);
            if (priceAndUnit) {
                console.log('Price and unit:', priceAndUnit)
                let { price, unit } = priceAndUnit;
                let milliliters = convertToMilliliters(1, unit); // Convert 1 unit to milliliters
                if (milliliters !== null) {
                    let pricePerMilliliter = price / milliliters;
                    items.push({
                        container: parentContainer,
                        pricePerMilliliter: pricePerMilliliter
                    });
                }
            }
        }
    } else {
        console.warn('No parent container found for element:', el)
    }
});

// Sort items by price per milliliter
items.sort((a, b) => a.pricePerMilliliter - b.pricePerMilliliter);

// Rearrange the items on the page
var parentElement = document.querySelector('.s-main-slot');
items.forEach(item => {
    parentElement.appendChild(item.container);
});

console.log('Items rearranged by lowest to highest price per unit of measure.');
