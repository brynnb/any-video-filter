javascript:(function() {
    // Select all product cards based on the given example
    var elements = document.querySelectorAll('div[data-qe-id="productCard"]');
    var elementsArray = Array.from(elements);
    
    // Function to extract price per unit
    var getPricePerUnit = (element) => {
        var pricePerUnitText = element.querySelector('span.sc-b1ffoz-2').textContent; // Selector for the price per unit element
        var matches = pricePerUnitText.match(/\$([\d\.]+) \/ (\w+)/); // Regex to extract the price and the unit
        if (!matches) return Infinity; // Return a high number if no price/unit found (keeps these items at the end of the list)
        var price = parseFloat(matches[1]);
        var unit = matches[2];
        
        // Convert all prices to per pound (lb) for consistent comparison (assuming all units here are weights)
        switch (unit) {
            case 'lb':
                return price;
            case 'oz': // Convert ounces to pounds (1 lb = 16 oz)
                return price * 16;
            default:
                return price; // Fallback if unit is neither 'lb' nor 'oz', unlikely based on your example
        }
    };

    // Sort elements by price per unit
    elementsArray.sort((a, b) => {
        var priceA = getPricePerUnit(a);
        var priceB = getPricePerUnit(b);
        return priceA - priceB; // Ascending order
    });

    // Re-insert sorted elements into the DOM
    var parent = elements[0].closest('[data-qe-id="productCard"]');
    parent.innerHTML = ''; // Clear existing content
    elementsArray.forEach(element => parent.appendChild(element)); // Append sorted elements
})();