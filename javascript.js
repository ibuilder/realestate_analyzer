// Real Estate Analyzer SCRUM - JavaScript Code
// This file contains all the logic for FAR analysis, proforma calculations and Excel output

class RealEstateAnalyzer {
    constructor() {
        this.propertyData = {
            address: {},
            propertySpecs: {},
            units: [],
            commonAreas: {},
            financials: {
                income: {},
                expenses: {},
                development: {}
            },
            proforma: {
                settings: {},
                metrics: {}
            }
        };
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Address form submission
        document.getElementById('step1Next').addEventListener('click', () => {
            this.collectAddressData();
        });
        
        // Property specs form submission
        document.getElementById('step2Next').addEventListener('click', () => {
            this.collectPropertySpecsData();
        });
        
        // Calculate FAR button
        document.getElementById('calculateFARBtn').addEventListener('click', () => {
            this.calculateFAR();
        });
        
        // Unit mix changes
        document.getElementById('addUnitBtn').addEventListener('click', () => {
            this.addUnitType();
            this.updateUnitMixSummary();
        });
        
        // Financial analysis button
        document.getElementById('step3Next').addEventListener('click', () => {
            this.populateIncomeTable();
        });
        
        // Calculate metrics button
        document.getElementById('calculateMetricsBtn').addEventListener('click', () => {
            this.calculateInvestmentMetrics();
        });
        
        // Generate Excel button
        document.getElementById('generateExcelBtn').addEventListener('click', () => {
            this.generateExcelProforma();
        });
    }
    
    collectAddressData() {
        this.propertyData.address = {
            street: document.getElementById('propertyAddress').value,
            city: document.getElementById('propertyCity').value,
            state: document.getElementById('propertyState').value,
            zip: document.getElementById('propertyZip').value
        };
        
        // You could add address validation here
        console.log('Address data collected:', this.propertyData.address);
    }
    
    collectPropertySpecsData() {
        this.propertyData.propertySpecs = {
            lotSize: parseFloat(document.getElementById('lotSize').value) || 10000,
            zoning: document.getElementById('zoning').value,
            maxFAR: parseFloat(document.getElementById('maxFAR').value) || 2.5,
            maxHeight: parseFloat(document.getElementById('maxHeight').value) || 60,
            setbacks: {
                front: parseFloat(document.getElementById('setbackFront').value) || 20,
                rear: parseFloat(document.getElementById('setbackRear').value) || 15,
                left: parseFloat(document.getElementById('setbackLeft').value) || 10,
                right: parseFloat(document.getElementById('setbackRight').value) || 10
            },
            minParkingRatio: parseFloat(document.getElementById('minParkingRatio').value) || 1.5,
            currentUse: document.getElementById('currentUse').value
        };
        
        console.log('Property specs collected:', this.propertyData.propertySpecs);
    }
    
    calculateFAR() {
        // Show loading state
        document.getElementById('loading').style.display = 'flex';
        
        setTimeout(() => {
            const lotSize = this.propertyData.propertySpecs.lotSize || 10000;
            const maxFAR = this.propertyData.propertySpecs.maxFAR || 2.5;
            
            // Calculate maximum buildable area
            const maxBuildableArea = lotSize * maxFAR;
            
            // Determine current FAR (0 if vacant land)
            let currentFAR = 0;
            switch(this.propertyData.propertySpecs.currentUse) {
                case 'vacant':
                    currentFAR = 0;
                    break;
                case 'sfr':
                    currentFAR = 0.3;
                    break;
                case 'mfr':
                    currentFAR = 1.0;
                    break;
                case 'retail':
                    currentFAR = 0.5;
                    break;
                case 'office':
                    currentFAR = 1.2;
                    break;
                case 'industrial':
                    currentFAR = 0.7;
                    break;
                case 'mixed':
                    currentFAR = 1.5;
                    break;
                default:
                    currentFAR = 0;
            }
            
            // Calculate potential FAR increase
            const currentBuildableArea = lotSize * currentFAR;
            const farIncrease = maxBuildableArea > currentBuildableArea ? 
                ((maxBuildableArea - currentBuildableArea) / currentBuildableArea * 100) : 0;
            
            // Update UI
            document.getElementById('maxBuildableArea').textContent = maxBuildableArea.toLocaleString();
            document.getElementById('currentFAR').textContent = currentFAR.toFixed(2);
            document.getElementById('farIncrease').textContent = currentBuildableArea > 0 ? 
                farIncrease.toFixed(0) + '%' : 'N/A (vacant land)';
            
            // Store results
            this.propertyData.farAnalysis = {
                maxBuildableArea,
                currentFAR,
                farIncrease: currentBuildableArea > 0 ? farIncrease : 100
            };
            
            // Hide loading state
            document.getElementById('loading').style.display = 'none';
            
            // Recommend optimal use based on zoning and market indicators
            this.recommendOptimalUse();
        }, 1000);
    }
    
    recommendOptimalUse() {
        // Based on zoning and FAR analysis, highlight the recommended usage option
        const zoning = this.propertyData.propertySpecs.zoning;
        let recommendedUse;
        
        // Simple logic for recommendation based on zoning (in reality, this would be more complex)
        if (zoning && zoning.startsWith('R')) {
            recommendedUse = 'residential';
        } else if (zoning && zoning.startsWith('C')) {
            recommendedUse = 'commercial';
        } else {
            recommendedUse = 'mixed';
        }
        
        // Highlight the recommended usage card
        document.querySelectorAll('.usage-card').forEach(card => {
            card.classList.remove('selected-usage');
            if (card.getAttribute('data-usage') === recommendedUse) {
                card.classList.add('selected-usage');
            }
        });
        
        console.log('Recommended use:', recommendedUse);
    }
    
    collectUnitData() {
        this.propertyData.units = [];
        const unitCards = document.querySelectorAll('.unit-card');
        
        unitCards.forEach(card => {
            const unitType = card.querySelector('.unit-type').value;
            const unitSize = parseFloat(card.querySelector('.unit-size').value) || 0;
            const unitQuantity = parseInt(card.querySelector('.unit-quantity').value) || 0;
            const unitRent = parseFloat(card.querySelector('.unit-rent').value) || 0;
            
            if (unitSize > 0 && unitQuantity > 0) {
                this.propertyData.units.push({
                    type: unitType,
                    size: unitSize,
                    quantity: unitQuantity,
                    rent: unitRent,
                    isCommercial: ['retail', 'office'].includes(unitType)
                });
            }
        });
        
        // Collect common areas
        this.propertyData.commonAreas = {
            lobby: parseFloat(document.getElementById('lobbySqft').value) || 0,
            amenity: parseFloat(document.getElementById('amenitySqft').value) || 0,
            circulation: parseFloat(document.getElementById('circulationSqft').value) || 0
        };
        
        console.log('Unit data collected:', this.propertyData.units);
        console.log('Common areas collected:', this.propertyData.commonAreas);
    }
    
    updateUnitMixSummary() {
        this.collectUnitData();
        
        // Calculate totals
        let totalUnits = 0;
        let totalResidentialArea = 0;
        let totalCommercialArea = 0;
        
        this.propertyData.units.forEach(unit => {
            totalUnits += unit.quantity;
            
            if (unit.isCommercial) {
                totalCommercialArea += unit.size * unit.quantity;
            } else {
                totalResidentialArea += unit.size * unit.quantity;
            }
        });
        
        const totalCommonArea = 
            this.propertyData.commonAreas.lobby + 
            this.propertyData.commonAreas.amenity + 
            this.propertyData.commonAreas.circulation;
        
        const totalBuildingArea = totalResidentialArea + totalCommercialArea + totalCommonArea;
        
        // Calculate FAR utilization
        const lotSize = this.propertyData.propertySpecs.lotSize || 10000;
        const maxBuildableArea = lotSize * (this.propertyData.propertySpecs.maxFAR || 2.5);
        const farUtilization = (totalBuildingArea / maxBuildableArea) * 100;
        
        // Update UI
        document.getElementById('totalUnits').textContent = totalUnits;
        document.getElementById('totalResidentialArea').textContent = totalResidentialArea.toLocaleString();
        document.getElementById('totalCommercialArea').textContent = totalCommercialArea.toLocaleString();
        document.getElementById('totalCommonArea').textContent = totalCommonArea.toLocaleString();
        document.getElementById('totalBuildingArea').textContent = totalBuildingArea.toLocaleString();
        document.getElementById('farUtilization').textContent = farUtilization.toFixed(1) + '%';
        
        // Store values
        this.propertyData.unitSummary = {
            totalUnits,
            totalResidentialArea,
            totalCommercialArea,
            totalCommonArea,
            totalBuildingArea,
            farUtilization
        };
    }
    
    populateIncomeTable() {
        this.collectUnitData();
        this.updateUnitMixSummary();
        
        // Clear the table
        const tableBody = document.querySelector('#rentalIncomeTable tbody');
        tableBody.innerHTML = '';
        
        // Calculate annual income for each unit type
        let totalPotentialGrossIncome = 0;
        
        this.propertyData.units.forEach(unit => {
            const annualRent = unit.rent * 12 * unit.quantity;
            totalPotentialGrossIncome += annualRent;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatUnitTypeName(unit.type)}</td>
                <td>${unit.quantity}</td>
                <td>$${unit.rent.toLocaleString()}</td>
                <td>$${annualRent.toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Update total PGI
        document.getElementById('totalPotentialGrossIncome').textContent = '$' + totalPotentialGrossIncome.toLocaleString();
        
        // Update income summary
        document.getElementById('pgiSummary').textContent = totalPotentialGrossIncome.toLocaleString();
        
        // Update other income values based on input
        const vacancyRate = parseFloat(document.getElementById('vacancyRate').value) || 5;
        const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
        
        const vacancyLoss = totalPotentialGrossIncome * (vacancyRate / 100);
        const effectiveGrossIncome = totalPotentialGrossIncome - vacancyLoss + otherIncome;
        
        document.getElementById('vacancyLoss').textContent = vacancyLoss.toLocaleString();
        document.getElementById('otherIncomeSummary').textContent = otherIncome.toLocaleString();
        document.getElementById('effectiveGrossIncome').textContent = effectiveGrossIncome.toLocaleString();
        
        // Store financial data
        this.propertyData.financials.income = {
            potentialGrossIncome: totalPotentialGrossIncome,
            vacancyRate,
            vacancyLoss,
            otherIncome,
            effectiveGrossIncome
        };
    }
    
    calculateOperatingExpenses() {
        // Collect expense data from form
        const propertyTaxes = parseFloat(document.getElementById('propertyTaxes').value) || 0;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;
        const utilities = parseFloat(document.getElementById('utilities').value) || 0;
        const repairsMaintenance = parseFloat(document.getElementById('repairsMaintenance').value) || 0;
        const propertyManagementPct = parseFloat(document.getElementById('propertyManagementPct').value) || 3;
        const otherExpenses = parseFloat(document.getElementById('otherExpenses').value) || 0;
        
        // Calculate property management fee
        const propertyManagement = this.propertyData.financials.income.effectiveGrossIncome * (propertyManagementPct / 100);
        
        // Calculate total operating expenses
        const totalOpEx = propertyTaxes + insurance + utilities + repairsMaintenance + propertyManagement + otherExpenses;
        
        // Calculate NOI
        const noi = this.propertyData.financials.income.effectiveGrossIncome - totalOpEx;
        
        // Calculate OpEx Ratio
        const opExRatio = (totalOpEx / this.propertyData.financials.income.effectiveGrossIncome) * 100;
        
        // Calculate Cap Rate (assuming a project cost estimate based on square footage)
        const estimatedProjectCost = this.estimateProjectCost();
        const capRate = estimatedProjectCost > 0 ? (noi / estimatedProjectCost) * 100 : 0;
        
        // Update UI
        document.getElementById('totalOpEx').textContent = totalOpEx.toLocaleString();
        document.getElementById('opExRatio').textContent = opExRatio.toFixed(1);
        document.getElementById('netOperatingIncome').textContent = noi.toLocaleString();
        document.getElementById('capRate').textContent = capRate.toFixed(2);
        
        // Store expense data
        this.propertyData.financials.expenses = {
            propertyTaxes,
            insurance,
            utilities,
            repairsMaintenance,
            propertyManagementPct,
            propertyManagement,
            otherExpenses,
            totalOpEx,
            opExRatio,
            noi,
            capRate
        };
        
        return { noi, capRate };
    }
    
    estimateProjectCost() {
        // Get development cost inputs
        const landCostPerSqFt = parseFloat(document.getElementById('landCostPerSqFt').value) || 100;
        const residentialConstructionCost = parseFloat(document.getElementById('residentialConstructionCost').value) || 250;
        const commercialConstructionCost = parseFloat(document.getElementById('commercialConstructionCost').value) || 200;
        const commonAreaConstructionCost = parseFloat(document.getElementById('commonAreaConstructionCost').value) || 180;
        const softCostsPct = parseFloat(document.getElementById('softCostsPct').value) || 20;
        const developmentFeePct = parseFloat(document.getElementById('developmentFeePct').value) || 5;
        const contingencyPct = parseFloat(document.getElementById('contingencyPct').value) || 10;
        const financingCostsPct = parseFloat(document.getElementById('financingCostsPct').value) || 5;
        
        // Calculate costs
        const landCost = this.propertyData.propertySpecs.lotSize * landCostPerSqFt;
        
        const residentialHardCost = this.propertyData.unitSummary.totalResidentialArea * residentialConstructionCost;
        const commercialHardCost = this.propertyData.unitSummary.totalCommercialArea * commercialConstructionCost;
        const commonAreaHardCost = this.propertyData.unitSummary.totalCommonArea * commonAreaConstructionCost;
        const totalHardCosts = residentialHardCost + commercialHardCost + commonAreaHardCost;
        
        const softCosts = totalHardCosts * (softCostsPct / 100);
        const developmentFee = (totalHardCosts + softCosts) * (developmentFeePct / 100);
        const contingency = (totalHardCosts + softCosts) * (contingencyPct / 100);
        const financingCosts = (totalHardCosts + softCosts + contingency) * (financingCostsPct / 100);
        
        const totalProjectCost = landCost + totalHardCosts + softCosts + developmentFee + contingency + financingCosts;
        
        // Calculate metrics
        const costPerGrossSF = totalProjectCost / this.propertyData.unitSummary.totalBuildingArea;
        
        // Calculate development yield
        const noi = this.propertyData.financials.expenses?.noi || 0;
        const developmentYield = noi > 0 ? (noi / totalProjectCost) * 100 : 0;
        
        // Update UI
        document.getElementById('totalLandCost').textContent = landCost.toLocaleString();
        document.getElementById('totalHardCosts').textContent = totalHardCosts.toLocaleString();
        document.getElementById('totalSoftCosts').textContent = softCosts.toLocaleString();
        document.getElementById('developmentFee').textContent = developmentFee.toLocaleString();
        document.getElementById('contingencyAmount').textContent = contingency.toLocaleString();
        document.getElementById('totalProjectCost').textContent = totalProjectCost.toLocaleString();
        document.getElementById('costPerGrossSF').textContent = costPerGrossSF.toFixed(2);
        document.getElementById('developmentYield').textContent = developmentYield.toFixed(2);
        
        // Store development data
        this.propertyData.financials.development = {
            landCostPerSqFt,
            residentialConstructionCost,
            commercialConstructionCost,
            commonAreaConstructionCost,
            softCostsPct,
            developmentFeePct,
            contingencyPct,
            financingCostsPct,
            landCost,
            residentialHardCost,
            commercialHardCost,
            commonAreaHardCost,
            totalHardCosts,
            softCosts,
            developmentFee,
            contingency,
            financingCosts,
            totalProjectCost,
            costPerGrossSF,
            developmentYield
        };
        
        return totalProjectCost;
    }
    
    calculateInvestmentMetrics() {
        // Show loading state
        document.getElementById('loading').style.display = 'flex';
        
        setTimeout(() => {
            // Collect inputs from the form
            const projectionYears = parseInt(document.getElementById('projectionYears').value) || 5;
            const rentGrowth = parseFloat(document.getElementById('rentGrowth').value) || 3;
            const expenseGrowth = parseFloat(document.getElementById('expenseGrowth').value) || 2;
            const exitCapRate = parseFloat(document.getElementById('exitCapRate').value) || 5.5;
            const discountRate = parseFloat(document.getElementById('discountRate').value) || 7;
            
            // Make sure we have the latest NOI and project cost
            this.populateIncomeTable();
            this.calculateOperatingExpenses();
            const totalProjectCost = this.estimateProjectCost();
            const initialNOI = this.propertyData.financials.expenses.noi;
            
            // Calculate 5-year cash flow
            const cashFlows = [];
            let cumulativeCashFlow = -totalProjectCost; // Invest upfront
            let noi = initialNOI;
            
            // Year 0 is just the investment
            cashFlows.push(-totalProjectCost);
            
            for (let year = 1; year <= projectionYears; year++) {
                // Grow NOI each year
                noi *= (1 + (rentGrowth - expenseGrowth) / 100);
                
                // If it's the last year, add sale proceeds
                if (year === projectionYears) {
                    const exitValue = noi / (exitCapRate / 100);
                    cashFlows.push(noi + exitValue);
                    cumulativeCashFlow += (noi + exitValue);
                } else {
                    cashFlows.push(noi);
                    cumulativeCashFlow += noi;
                }
            }
            
            // Calculate metrics
            
            // ROI (simple)
            const roi = (cumulativeCashFlow / totalProjectCost) * 100;
            
            // IRR (simplified calculation)
            const irr = this.calculateIRR(cashFlows, 0, 50);
            
            // NPV
            const npv = this.calculateNPV(cashFlows, discountRate / 100);
            
            // Cash on Cash (Year 1)
            const cocReturn = (initialNOI / totalProjectCost) * 100;
            
            // DSCR (simplified, assuming 75% LTV, 30-year amortization, 4.5% interest rate)
            const loanAmount = totalProjectCost * 0.75;
            const annualDebtService = this.calculateAnnualDebtService(loanAmount, 4.5, 30);
            const dscr = initialNOI / annualDebtService;
            
            // Payback period (simplified calculation)
            const paybackPeriod = totalProjectCost / initialNOI;
            
            // Update UI
            document.getElementById('roiMetric').textContent = roi.toFixed(2);
            document.getElementById('irrMetric').textContent = irr.toFixed(2);
            document.getElementById('npvMetric').textContent = npv.toLocaleString();
            document.getElementById('cocMetric').textContent = cocReturn.toFixed(2);
            document.getElementById('dscrMetric').textContent = dscr.toFixed(2);
            document.getElementById('paybackMetric').textContent = paybackPeriod.toFixed(1);
            
            // Store metrics
            this.propertyData.proforma.settings = {
                projectionYears,
                rentGrowth,
                expenseGrowth,
                exitCapRate,
                discountRate
            };
            
            this.propertyData.proforma.metrics = {
                roi,
                irr,
                npv,
                cocReturn,
                dscr,
                paybackPeriod,
                cashFlows
            };
            
            // Hide loading state
            document.getElementById('loading').style.display = 'none';
        }, 1000);
    }
    
    calculateIRR(cashFlows, min, max) {
        // Using bisection method to estimate IRR
        const EPSILON = 0.1; // Accuracy threshold
        let mid = (min + max) / 2;
        
        const f = rate => {
            let npv = 0;
            for (let i = 0; i < cashFlows.length; i++) {
                npv += cashFlows[i] / Math.pow(1 + rate / 100, i);
            }
            return npv;
        };
        
        if (Math.abs(max - min) < EPSILON) {
            return mid;
        }
        
        const fMid = f(mid);
        
        if (fMid > 0) {
            return this.calculateIRR(cashFlows, mid, max);
        } else if (fMid < 0) {
            return this.calculateIRR(cashFlows, min, mid);
        } else {
            return mid;
        }
    }
    
    calculateNPV(cashFlows, rate) {
        let npv = 0;
        for (let i = 0; i < cashFlows.length; i++) {
            npv += cashFlows[i] / Math.pow(1 + rate, i);
        }
        return npv;
    }
    
    calculateAnnualDebtService(loanAmount, interestRate, termYears) {
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = termYears * 12;
        const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) 
            / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        return monthlyPayment * 12;
    }
    
    generateExcelProforma() {
        // Show loading state
        document.getElementById('loading').style.display = 'flex';
        
        setTimeout(() => {
            // Make sure we have the latest data
            this.collectUnitData();
            this.populateIncomeTable();
            this.calculateOperatingExpenses();
            this.estimateProjectCost();
            
            // Format data for Excel
            const excelData = this.formatDataForExcel();
            
            // Store Excel data (in a real app, this would create an actual Excel file)
            this.excelData = excelData;
            
            // Update modal values
            document.getElementById('modalFAR').textContent = (this.propertyData.unitSummary.totalBuildingArea / this.propertyData.propertySpecs.lotSize).toFixed(2);
            document.getElementById('modalNOI').textContent = this.propertyData.financials.expenses.noi.toLocaleString();
            document.getElementById('modalCapRate').textContent = this.propertyData.financials.expenses.capRate.toFixed(2);
            document.getElementById('modalTotalCost').textContent = this.propertyData.financials.development.totalProjectCost.toLocaleString();
            document.getElementById('modalIRR').textContent = (this.propertyData.proforma.metrics?.irr || 0).toFixed(2);
            
            // Hide loading state
            document.getElementById('loading').style.display = 'none';
            
            // In a real app, this would generate a downloadable Excel file
            console.log('Excel proforma data ready:', excelData);
        }, 2000);
    }
    
    formatDataForExcel() {
        // In a real app, this would structure the data for Excel output
        // Here we're just preparing a sample data structure
        return {
            propertySummary: {
                address: this.propertyData.address,
                specs: this.propertyData.propertySpecs,
                farAnalysis: {
                    lotSize: this.propertyData.propertySpecs.lotSize,
                    maxFAR: this.propertyData.propertySpecs.maxFAR,
                    maxBuildableArea: this.propertyData.propertySpecs.lotSize * this.propertyData.propertySpecs.maxFAR,
                    actualBuildingArea: this.propertyData.unitSummary.totalBuildingArea,
                    actualFAR: this.propertyData.unitSummary.totalBuildingArea / this.propertyData.propertySpecs.lotSize,
                    farUtilization: this.propertyData.unitSummary.farUtilization
                }
            },
            unitBreakdown: {
                units: this.propertyData.units,
                commonAreas: this.propertyData.commonAreas,
                summary: this.propertyData.unitSummary
            },
            financialAnalysis: {
                income: this.propertyData.financials.income,
                expenses: this.propertyData.financials.expenses
            },
            developmentCosts: this.propertyData.financials.development,
            cashFlowProjection: {
                settings: this.propertyData.proforma.settings,
                metrics: this.propertyData.proforma.metrics,
                annualCashFlows: this.generateAnnualCashFlows()
            }
        };
    }
    
    generateAnnualCashFlows() {
        // Generate year-by-year cash flow projections
        const years = this.propertyData.proforma.settings?.projectionYears || 5;
        const rentGrowth = this.propertyData.proforma.settings?.rentGrowth || 3;
        const expenseGrowth = this.propertyData.proforma.settings?.expenseGrowth || 2;
        const exitCapRate = this.propertyData.proforma.settings?.exitCapRate || 5.5;
        
        const annualCashFlows = [];
        let noi = this.propertyData.financials.expenses?.noi || 0;
        
        for (let year = 1; year <= years; year++) {
            const rentGrowthFactor = Math.pow(1 + rentGrowth / 100, year - 1);
            const expenseGrowthFactor = Math.pow(1 + expenseGrowth / 100, year - 1);
            
            const yearlyIncome = this.propertyData.financials.income.effectiveGrossIncome * rentGrowthFactor;
            const yearlyExpenses = this.propertyData.financials.expenses.totalOpEx * expenseGrowthFactor;
            const yearlyNOI = yearlyIncome - yearlyExpenses;
            
            let exitValue = 0;
            if (year === years) {
                // Calculate exit value in the final year
                const nextYearNOI = yearlyNOI * (1 + rentGrowth / 100);
                exitValue = nextYearNOI / (exitCapRate / 100);
            }
            
            annualCashFlows.push({
                year,
                income: yearlyIncome,
                expenses: yearlyExpenses,
                noi: yearlyNOI,
                exitValue: exitValue,
                totalCashFlow: yearlyNOI + exitValue
            });
        }
        
        return annualCashFlows;
    }
    
    formatUnitTypeName(unitType) {
        const typeNames = {
            'studio': 'Studio',
            '1br': '1 Bedroom',
            '2br': '2 Bedroom',
            '3br': '3 Bedroom',
            'retail': 'Retail Space',
            'office': 'Office Space'
        };
        
        return typeNames[unitType] || unitType;
    }
    
    addUnitType() {
        const unitList = document.getElementById('unitList');
        const firstUnitCard = unitList.querySelector('.unit-card');
        
        if (firstUnitCard) {
            const newUnitCard = firstUnitCard.cloneNode(true);
            
            // Reset values
            newUnitCard.querySelectorAll('input').forEach(input => {
                input.value = '';
            });
            
            // Reset select
            const selectElement = newUnitCard.querySelector('select');
            if (selectElement) {
                selectElement.selectedIndex = 0;
            }
            
            // Add to list
            unitList.appendChild(newUnitCard);
            
            // Rebind event listeners for remove buttons
            this.bindRemoveUnitButtons();
        }
    }
    
    bindRemoveUnitButtons() {
        document.querySelectorAll('.remove-unit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const unitCards = document.querySelectorAll('.unit-card');
                if (unitCards.length > 1) {
                    const unitCard = e.target.closest('.unit-card');
                    if (unitCard) {
                        unitCard.remove();
                        this.updateUnitMixSummary();
                    }
                } else {
                    alert('You need at least one unit type.');
                }
            });
        });
    }
}