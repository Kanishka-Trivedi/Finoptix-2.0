# Step-up SIP and Step-up SWP Calculators

## Overview

Added two new advanced calculators to the scheme detail page:
1. **Step-up SIP Calculator** - Systematic Investment Plan with periodic increases
2. **Step-up SWP Calculator** - Systematic Withdrawal Plan with periodic increases

## Features

### Step-up SIP Calculator

**Purpose**: Calculate returns when you increase your SIP amount periodically (e.g., 10% every year)

**Input Parameters**:
- Initial Investment Amount (₹)
- Step-up Percentage (%)
- SIP Frequency (Monthly/Quarterly)
- Step-up Frequency (Yearly/Half-Yearly)
- Start Date and End Date

**Calculation Logic**:
1. Starts with initial SIP amount
2. Invests at specified frequency (monthly/quarterly)
3. Increases investment amount by step-up percentage at step-up intervals
4. Purchases units based on actual NAV on investment dates
5. Calculates total invested, current value, and returns

**Formula**:
```
For each investment date:
  - If step-up interval reached: SIP Amount = SIP Amount × (1 + Step-up%)
  - Units Purchased = SIP Amount / NAV on that date
  - Total Units = Sum of all units purchased

Final Value = Total Units × Latest NAV
Absolute Return = ((Final Value - Total Invested) / Total Invested) × 100
Annualized Return = ((Final Value / Total Invested)^(1/Years) - 1) × 100
```

**Output**:
- Total Invested
- Current Value
- Absolute Return (%)
- Annualized Return (%)
- Total Units Purchased
- Wealth Gain
- Investment Growth Chart

---

### Step-up SWP Calculator

**Purpose**: Calculate withdrawals when you increase your withdrawal amount periodically (useful for inflation-adjusted income)

**Input Parameters**:
- Initial Investment (₹)
- Initial Withdrawal Amount (₹)
- Step-up Percentage (%)
- Withdrawal Frequency (Monthly/Quarterly)
- Step-up Frequency (Yearly/Half-Yearly)
- Start Date and End Date

**Calculation Logic**:
1. Invests lump sum amount initially
2. Withdraws at specified frequency (monthly/quarterly)
3. Increases withdrawal amount by step-up percentage at step-up intervals
4. Redeems units based on actual NAV on withdrawal dates
5. Tracks remaining balance and total withdrawals

**Formula**:
```
Initial Units = Initial Investment / Starting NAV

For each withdrawal date:
  - If step-up interval reached: Withdrawal = Withdrawal × (1 + Step-up%)
  - Units Redeemed = Withdrawal Amount / NAV on that date
  - Remaining Units = Remaining Units - Units Redeemed
  - Total Withdrawn += Withdrawal Amount

Final Balance = Remaining Units × Latest NAV
Total Value = Total Withdrawn + Final Balance
Absolute Return = ((Total Value - Initial Investment) / Initial Investment) × 100
Annualized Return = ((Total Value / Initial Investment)^(1/Years) - 1) × 100
```

**Output**:
- Total Withdrawn
- Final Balance
- Absolute Return (%)
- Annualized Return (%)
- Remaining Units
- Net Gain/Loss
- Balance Over Time Chart

---

## Accurate Calculations

### Date Handling
- Supports both date formats: `dd-MM-yyyy` (API) and `yyyy-MM-dd` (user input)
- Filters NAV data within selected date range
- Uses actual NAV values on investment/withdrawal dates

### Frequency Calculations
- **Monthly**: 30 days
- **Quarterly**: 90 days
- **Yearly**: 365 days
- **Half-Yearly**: 182 days

### Step-up Logic
- Tracks days since last step-up
- Applies percentage increase when interval is reached
- Compounds the increase (e.g., Year 1: ₹5000, Year 2: ₹5500, Year 3: ₹6050)

### Return Calculations

**Absolute Return**:
```
((Final Value - Total Invested) / Total Invested) × 100
```

**Annualized Return (CAGR)**:
```
((Final Value / Total Invested)^(1/Years) - 1) × 100
```

This accounts for the time value of money and provides accurate comparison across different time periods.

---

## UI Integration

### Sidebar Navigation
Added two new menu items:
- **Step-up SIP** (ShowChart icon)
- **Step-up SWP** (TrendingDown icon)

### Color Scheme
Maintains existing color palette:
- Purple (#B8A4D9) - Primary
- Green (#A4D9C4) - Secondary
- Orange (#F5D4A4) - Accent
- Light Green (#88C785) - Positive returns
- Light Red (#E88585) - Negative returns

### Charts
- **Step-up SIP**: Line chart showing invested vs current value over time
- **Step-up SWP**: Area chart showing balance decline and total withdrawals

---

## API Endpoints

### `/api/scheme/[code]/stepup-sip`
- Method: POST
- Calculates step-up SIP returns using actual NAV data
- Returns detailed breakdown with chart data

### `/api/scheme/[code]/stepup-swp`
- Method: POST
- Calculates step-up SWP returns using actual NAV data
- Returns detailed breakdown with chart data

---

## Example Use Cases

### Step-up SIP
**Scenario**: Start with ₹5,000/month, increase by 10% every year
- Year 1: ₹5,000/month
- Year 2: ₹5,500/month
- Year 3: ₹6,050/month
- Year 4: ₹6,655/month

**Benefit**: Matches salary increments and inflation, builds larger corpus

### Step-up SWP
**Scenario**: Start with ₹10,000/month withdrawal, increase by 5% every year
- Year 1: ₹10,000/month
- Year 2: ₹10,500/month
- Year 3: ₹11,025/month
- Year 4: ₹11,576/month

**Benefit**: Inflation-adjusted income for retirement planning

---

## Files Created

1. `src/components/StepUpSIPCalculator.js` - Frontend component
2. `src/components/StepUpSWPCalculator.js` - Frontend component
3. `src/pages/api/scheme/[code]/stepup-sip.js` - Backend API
4. `src/pages/api/scheme/[code]/stepup-swp.js` - Backend API

## Files Modified

1. `src/pages/scheme/[code].js` - Added new calculators to sidebar

---

## Testing

To test the calculators:
1. Navigate to any scheme detail page
2. Click "Step-up SIP" or "Step-up SWP" in the sidebar
3. Enter parameters and click "Calculate Returns"
4. Verify calculations match expected results

---

## Notes

- All calculations use actual historical NAV data
- Returns are based on real market performance
- Step-up feature helps combat inflation
- Useful for long-term financial planning
- Charts provide visual representation of growth/decline
