# Real Estate Analyzer SCRUM

![Real Estate Analyzer](https://api/placeholder/800/400)

## Overview

Real Estate Analyzer SCRUM is a comprehensive web application designed to help real estate developers, investors, and analysts evaluate property development opportunities. The application follows SCRUM methodology to guide users through the complete analysis process, from property address input to generating detailed financial proformas.

## Key Features

- **SCRUM Workflow**: Step-by-step guided process following agile principles
- **FAR Analysis**: Calculate Floor Area Ratio and determine optimal buildable area
- **Functional Use Determination**: Identify the best use for a property based on zoning and market factors
- **Unit Mix Planning**: Design and optimize residential and commercial unit configurations
- **Financial Analysis**: Comprehensive income and expense projections
- **Development Cost Estimation**: Detailed breakdown of all construction and development costs
- **Investment Metrics**: Calculate ROI, IRR, NPV, Cash-on-Cash return, and more
- **Excel Proforma Generation**: Create detailed financial models for investment analysis

## Technology Stack

- **Front-end**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **JavaScript Libraries**: jQuery
- **Excel Generation**: SheetJS (XLSX)

## Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server for hosting (Node.js, Apache, Nginx, etc.)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/real-estate-analyzer-scrum.git
   ```

2. Navigate to the project directory:
   ```
   cd real-estate-analyzer-scrum
   ```

3. If you're using Node.js and npm:
   ```
   npm install
   npm start
   ```

4. Alternatively, if you're using a traditional web server, simply copy the files to your web server directory.

## Usage Guide

### 1. Address Input

- Enter the property address including street, city, state, and zip code
- This information will be used for location-based analysis and reporting

### 2. Property Specifications

- Input property details including:
  - Lot size
  - Zoning classification
  - Maximum FAR allowed
  - Maximum height
  - Setback requirements
  - Parking ratio requirements
  - Current use

### 3. Unit Planning

- Calculate FAR to determine maximum buildable area
- Select optimal functional use (residential, commercial, mixed-use)
- Configure unit mix:
  - Add different unit types (studio, 1BR, 2BR, retail, office, etc.)
  - Set size, quantity, and rental rates for each unit type
  - Define common areas (lobby, amenities, circulation)
- View real-time calculations of area utilization and FAR compliance

### 4. Financial Analysis

- **Income Tab**:
  - View potential gross income based on unit mix
  - Set vacancy rate and additional income sources
  - Calculate effective gross income

- **Expenses Tab**:
  - Enter operating expenses (taxes, insurance, utilities, etc.)
  - Set property management fee percentage
  - Calculate net operating income and cap rate

- **Development Tab**:
  - Configure development costs including:
    - Land acquisition costs
    - Construction costs by space type
    - Soft costs and contingencies
  - View development cost summary and metrics

### 5. Proforma Output

- Configure projection settings:
  - Projection period (5, 10, 15, or 20 years)
  - Annual rent and expense growth rates
  - Exit cap rate and discount rate
- View investment metrics
- Generate detailed Excel proforma with:
  - Property summary
  - Unit breakdown
  - Financial analysis
  - Development costs
  - Cash flow projections
  - Investment metrics

## Excel Proforma Structure

The generated Excel file includes the following sheets:

1. **Executive Summary**: Overview of key metrics and recommendation
2. **Property Summary**: Property details and FAR analysis
3. **Unit Breakdown**: Detailed unit mix and area calculations
4. **Income Analysis**: Rental income projections and analysis
5. **Expense Analysis**: Operating expense breakdown and NOI calculation
6. **Development Costs**: Detailed construction and development cost analysis
7. **Cash Flow Projection**: Multi-year cash flow model
8. **Investment Metrics**: ROI, IRR, NPV, and other performance indicators
9. **Financing**: Loan analysis and debt service calculations
10. **Scenarios**: Comparison of different development options

## SCRUM Implementation

The application implements SCRUM methodology with:

- **Sprint Backlog**: Task list tracking progress through the analysis process
- **Iterative Approach**: Each step builds on previous inputs
- **Clear User Stories**: Each section addresses specific analysis needs
- **Visual Feedback**: Progress indicators and summary displays

## Customization

The application can be customized in several ways:

### Zoning Presets

To add or modify zoning classifications, edit the options in the zoning dropdown in `index.html`:

```html
<select class="form-select" id="zoning">
    <option value="R1">R1 - Single Family Residential</option>
    <!-- Add custom zones here -->
</select>
```

### Construction Cost Presets

Default construction costs can be modified in `real-estate-analyzer.js` by changing the initial values:

```javascript
const residentialConstructionCost = parseFloat(document.getElementById('residentialConstructionCost').value) || 250;
```

### Proforma Settings

Modify default proforma settings by changing initial values in the respective input fields or in the JavaScript initialization.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/real-estate-analyzer-scrum](https://github.com/yourusername/real-estate-analyzer-scrum)

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [jQuery](https://jquery.com/)
- [SheetJS](https://sheetjs.com/)