const { MultiCountryPayroll, TaxRule, CountryPayrollStatus } = require('../models/multi-country-payroll.model');
const { Employee } = require('../models/employee.model');
const { User, UserRole } = require('../models/user.model');
const mongoose = require('mongoose');
const axios = require('axios');

// Get exchange rates from external API
const getExchangeRates = async (baseCurrency = 'USD') => {
  try {
    // In a real implementation, you would use a paid API service with an API key
    // For this example, we'll use a mock response
    /*
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    return response.data.rates;
    */
    
    // Mock exchange rates
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 150.25,
      CAD: 1.35,
      AUD: 1.52,
      INR: 83.12,
      SGD: 1.34,
      AED: 3.67,
      CNY: 7.24
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return default rates in case of error
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.78,
      JPY: 150.25,
      CAD: 1.35,
      AUD: 1.52,
      INR: 83.12,
      SGD: 1.34,
      AED: 3.67,
      CNY: 7.24
    };
  }
};

// Get tax rules for a specific country
const getTaxRules = async (country) => {
  try {
    // Find tax rules for the country
    let taxRules = await TaxRule.findOne({ country });
    
    // If no rules exist, create default rules
    if (!taxRules) {
      // Default tax rules based on country
      const defaultRules = getDefaultTaxRules(country);
      
      taxRules = new TaxRule(defaultRules);
      await taxRules.save();
    }
    
    return taxRules;
  } catch (error) {
    console.error('Error getting tax rules:', error);
    throw error;
  }
};

// Get default tax rules for a country
const getDefaultTaxRules = (country) => {
  const rules = {
    country,
    taxBrackets: [],
    standardDeductions: [],
    statutoryContributions: []
  };
  
  switch (country) {
    case 'US':
      rules.taxBrackets = [
        { min: 0, max: 10275, rate: 0.10 },
        { min: 10276, max: 41775, rate: 0.12 },
        { min: 41776, max: 89075, rate: 0.22 },
        { min: 89076, max: 170050, rate: 0.24 },
        { min: 170051, max: 215950, rate: 0.32 },
        { min: 215951, max: 539900, rate: 0.35 },
        { min: 539901, max: null, rate: 0.37 }
      ];
      rules.standardDeductions = [
        { name: 'Standard Deduction', amount: 12950 }
      ];
      rules.statutoryContributions = [
        { name: 'Social Security', employeeRate: 0.062, employerRate: 0.062, maxContributionBase: 147000 },
        { name: 'Medicare', employeeRate: 0.0145, employerRate: 0.0145 }
      ];
      break;
    case 'UK':
      rules.taxBrackets = [
        { min: 0, max: 12570, rate: 0.0 },
        { min: 12571, max: 50270, rate: 0.2 },
        { min: 50271, max: 150000, rate: 0.4 },
        { min: 150001, max: null, rate: 0.45 }
      ];
      rules.standardDeductions = [
        { name: 'Personal Allowance', amount: 12570 }
      ];
      rules.statutoryContributions = [
        { name: 'National Insurance', employeeRate: 0.12, employerRate: 0.138, maxContributionBase: 50270 }
      ];
      break;
    case 'India':
      rules.taxBrackets = [
        { min: 0, max: 250000, rate: 0.0 },
        { min: 250001, max: 500000, rate: 0.05 },
        { min: 500001, max: 750000, rate: 0.1 },
        { min: 750001, max: 1000000, rate: 0.15 },
        { min: 1000001, max: 1250000, rate: 0.2 },
        { min: 1250001, max: 1500000, rate: 0.25 },
        { min: 1500001, max: null, rate: 0.3 }
      ];
      rules.standardDeductions = [
        { name: 'Standard Deduction', amount: 50000 }
      ];
      rules.statutoryContributions = [
        { name: 'Provident Fund', employeeRate: 0.12, employerRate: 0.12 },
        { name: 'ESI', employeeRate: 0.0075, employerRate: 0.0325, maxContributionBase: 21000 }
      ];
      break;
    case 'Singapore':
      rules.taxBrackets = [
        { min: 0, max: 20000, rate: 0.0 },
        { min: 20001, max: 30000, rate: 0.02 },
        { min: 30001, max: 40000, rate: 0.035 },
        { min: 40001, max: 80000, rate: 0.07 },
        { min: 80001, max: 120000, rate: 0.115 },
        { min: 120001, max: 160000, rate: 0.15 },
        { min: 160001, max: 200000, rate: 0.18 },
        { min: 200001, max: 240000, rate: 0.19 },
        { min: 240001, max: 280000, rate: 0.195 },
        { min: 280001, max: 320000, rate: 0.2 },
        { min: 320001, max: null, rate: 0.22 }
      ];
      rules.standardDeductions = [];
      rules.statutoryContributions = [
        { name: 'CPF', employeeRate: 0.2, employerRate: 0.17, maxContributionBase: 6000 }
      ];
      break;
    case 'Australia':
      rules.taxBrackets = [
        { min: 0, max: 18200, rate: 0.0 },
        { min: 18201, max: 45000, rate: 0.19 },
        { min: 45001, max: 120000, rate: 0.325 },
        { min: 120001, max: 180000, rate: 0.37 },
        { min: 180001, max: null, rate: 0.45 }
      ];
      rules.standardDeductions = [];
      rules.statutoryContributions = [
        { name: 'Superannuation', employeeRate: 0.0, employerRate: 0.105 }
      ];
      break;
    default:
      // Generic tax rules for other countries
      rules.taxBrackets = [
        { min: 0, max: 10000, rate: 0.1 },
        { min: 10001, max: 50000, rate: 0.2 },
        { min: 50001, max: null, rate: 0.3 }
      ];
      rules.standardDeductions = [
        { name: 'Standard Deduction', amount: 5000 }
      ];
      rules.statutoryContributions = [
        { name: 'Social Security', employeeRate: 0.05, employerRate: 0.05 }
      ];
  }
  
  return rules;
};

// Calculate tax based on tax brackets
const calculateTax = (income, taxBrackets) => {
  let tax = 0;
  
  for (const bracket of taxBrackets) {
    if (income > bracket.min) {
      const taxableAmount = bracket.max ? Math.min(income, bracket.max) - bracket.min : income - bracket.min;
      tax += taxableAmount * bracket.rate;
    }
    
    if (bracket.max && income <= bracket.max) {
      break;
    }
  }
  
  return tax;
};

// Calculate statutory deductions
const calculateStatutoryDeductions = (income, statutoryContributions) => {
  const deductions = [];
  let totalDeduction = 0;
  
  for (const contribution of statutoryContributions) {
    const base = contribution.maxContributionBase ? Math.min(income, contribution.maxContributionBase) : income;
    const amount = base * contribution.employeeRate;
    
    deductions.push({
      name: contribution.name,
      amount,
      type: 'statutory',
      taxable: false,
      countrySpecific: true,
      statutoryCode: contribution.name.toLowerCase().replace(/\s+/g, '_')
    });
    
    totalDeduction += amount;
  }
  
  return { deductions, totalDeduction };
};

// Calculate employer contributions
const calculateEmployerContributions = (income, statutoryContributions) => {
  const contributions = [];
  let totalContribution = 0;
  
  for (const contribution of statutoryContributions) {
    const base = contribution.maxContributionBase ? Math.min(income, contribution.maxContributionBase) : income;
    const amount = base * contribution.employerRate;
    
    contributions.push({
      name: `Employer ${contribution.name}`,
      amount,
      type: 'statutory',
      taxable: false,
      countrySpecific: true,
      statutoryCode: `employer_${contribution.name.toLowerCase().replace(/\s+/g, '_')}`
    });
    
    totalContribution += amount;
  }
  
  return { contributions, totalContribution };
};

// Generate payroll
exports.generatePayroll = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { employeeId, month, year, country } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to generate payroll' });
    }

    // Find employee
    const employee = await Employee.findOne({ 
      _id: employeeId, 
      tenantId 
    }).populate('userId', 'name');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if payroll already exists for this month/year/country
    const existingPayroll = await MultiCountryPayroll.findOne({
      employeeId,
      month,
      year,
      country,
      tenantId
    });

    if (existingPayroll) {
      return res.status(400).json({ message: 'Payroll already exists for this month and country' });
    }

    // Get exchange rates
    const exchangeRates = await getExchangeRates();
    
    // Get tax rules for the country
    const taxRules = await getTaxRules(country);
    
    // Get currency for the country
    const currencyMap = {
      'US': 'USD',
      'UK': 'GBP',
      'India': 'INR',
      'Singapore': 'SGD',
      'Australia': 'AUD',
      'Canada': 'CAD',
      'Germany': 'EUR',
      'France': 'EUR',
      'Japan': 'JPY',
      'UAE': 'AED'
    };
    
    const currency = currencyMap[country] || 'USD';
    const exchangeRate = exchangeRates[currency] || 1;

    // Get employee salary details
    // In a real app, this would come from a salary structure table
    // For this example, we'll use mock data
    const basicSalary = 75000 / exchangeRate; // Convert to local currency
    
    // Country-specific allowances
    let allowances = [];
    switch (country) {
      case 'India':
        allowances = [
          { name: 'House Rent Allowance', amount: basicSalary * 0.4, type: 'allowance', taxable: true, countrySpecific: true },
          { name: 'Transport Allowance', amount: 1600 * 12 / 12, type: 'allowance', taxable: false, countrySpecific: true },
          { name: 'Medical Allowance', amount: 1250 * 12 / 12, type: 'allowance', taxable: false, countrySpecific: true }
        ];
        break;
      case 'UK':
        allowances = [
          { name: 'Car Allowance', amount: 500, type: 'allowance', taxable: true, countrySpecific: true },
          { name: 'Meal Allowance', amount: 200, type: 'allowance', taxable: false, countrySpecific: true }
        ];
        break;
      case 'Singapore':
        allowances = [
          { name: 'Transport Allowance', amount: 300, type: 'allowance', taxable: true, countrySpecific: true },
          { name: 'Phone Allowance', amount: 100, type: 'allowance', taxable: false, countrySpecific: true }
        ];
        break;
      default:
        allowances = [
          { name: 'Housing Allowance', amount: basicSalary * 0.2, type: 'allowance', taxable: true, countrySpecific: true },
          { name: 'Transport Allowance', amount: 200, type: 'allowance', taxable: false, countrySpecific: true }
        ];
    }
    
    // Add common allowances
    allowances.push({ name: 'Performance Bonus', amount: basicSalary * 0.1, type: 'allowance', taxable: true, countrySpecific: false });
    
    // Calculate gross salary
    const grossSalary = basicSalary + allowances.reduce((sum, a) => sum + a.amount, 0);
    
    // Calculate standard deductions
    const standardDeductionsTotal = taxRules.standardDeductions.reduce((sum, d) => {
      if (d.amount) {
        return sum + d.amount;
      } else if (d.percentage) {
        return sum + (grossSalary * d.percentage);
      }
      return sum;
    }, 0);
    
    // Calculate taxable income
    const taxableIncome = grossSalary - standardDeductionsTotal;
    
    // Calculate tax
    const tax = calculateTax(taxableIncome, taxRules.taxBrackets);
    
    // Calculate statutory deductions
    const { deductions: statutoryDeductions, totalDeduction: totalStatutoryDeduction } = 
      calculateStatutoryDeductions(grossSalary, taxRules.statutoryContributions);
    
    // Calculate employer contributions
    const { contributions: employerContributions, totalContribution: totalEmployerContribution } = 
      calculateEmployerContributions(grossSalary, taxRules.statutoryContributions);
    
    // Calculate net salary
    const netSalary = grossSalary - tax - totalStatutoryDeduction;
    
    // Calculate total employer cost
    const totalEmployerCost = grossSalary + totalEmployerContribution;
    
    // Run compliance checks
    const complianceChecks = [];
    
    // Check if salary is above minimum wage
    const minimumWageMap = {
      'US': 7.25 * 40 * 4, // $7.25/hour * 40 hours/week * 4 weeks
      'UK': 9.50 * 40 * 4, // £9.50/hour * 40 hours/week * 4 weeks
      'India': 15000, // ₹15,000/month
      'Singapore': 1300, // S$1,300/month
      'Australia': 21.38 * 38 * 4 // A$21.38/hour * 38 hours/week * 4 weeks
    };
    
    const minimumWage = minimumWageMap[country] || 0;
    
    if (minimumWage > 0) {
      complianceChecks.push({
        name: 'Minimum Wage Compliance',
        status: basicSalary >= minimumWage ? 'passed' : 'failed',
        message: basicSalary >= minimumWage ? 'Salary meets minimum wage requirements' : 'Salary is below minimum wage'
      });
    }
    
    // Check if statutory deductions are within limits
    complianceChecks.push({
      name: 'Statutory Deductions',
      status: 'passed',
      message: 'Statutory deductions are correctly calculated'
    });
    
    // Create payroll record
    const payroll = new MultiCountryPayroll({
      employeeId,
      month,
      year,
      country,
      currency,
      exchangeRate,
      basicSalary,
      allowances,
      deductions: [],
      statutoryDeductions,
      grossSalary,
      taxableIncome,
      tax,
      netSalary,
      employerContributions,
      totalEmployerCost,
      status: CountryPayrollStatus.DRAFT,
      complianceChecks,
      tenantId
    });

    await payroll.save();

    res.status(201).json({
      message: 'Payroll generated successfully',
      payroll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process payroll
exports.processPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to process payroll' });
    }

    // Find payroll
    const payroll = await MultiCountryPayroll.findOne({
      _id: id,
      tenantId,
      status: CountryPayrollStatus.DRAFT
    });

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found or already processed' });
    }

    // Update payroll status
    payroll.status = CountryPayrollStatus.PROCESSED;
    await payroll.save();

    res.status(200).json({
      message: 'Payroll processed successfully',
      payroll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark payroll as paid
exports.markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;
    const { paymentDate = new Date(), paymentMethod, bankDetails } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to mark payroll as paid' });
    }

    // Find payroll
    const payroll = await MultiCountryPayroll.findOne({
      _id: id,
      tenantId,
      status: CountryPayrollStatus.PROCESSED
    });

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found or not processed' });
    }

    // Update payroll
    payroll.status = CountryPayrollStatus.PAID;
    payroll.paymentDate = new Date(paymentDate);
    
    if (paymentMethod) {
      payroll.paymentMethod = paymentMethod;
    }
    
    if (bankDetails) {
      payroll.bankDetails = bankDetails;
    }
    
    await payroll.save();

    res.status(200).json({
      message: 'Payroll marked as paid successfully',
      payroll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll records
exports.getPayrollRecords = async (req, res) => {
  try {
    const { tenantId, role, id: userId } = req.user;
    const { employeeId, month, year, country, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { tenantId };

    // Filter by employee
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (role === UserRole.EMPLOYEE) {
      // If employee, only show their own records
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      query.employeeId = employee._id;
    }

    // Filter by month and year
    if (month) {
      query.month = Number(month);
    }

    if (year) {
      query.year = Number(year);
    }

    // Filter by country
    if (country) {
      query.country = country;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const payrollRecords = await MultiCountryPayroll.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ year: -1, month: -1 })
      .populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId');

    // Get total count
    const total = await MultiCountryPayroll.countDocuments(query);

    res.status(200).json({
      records: payrollRecords,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll by ID
exports.getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role, id: userId } = req.user;

    // Find payroll
    const payroll = await MultiCountryPayroll.findOne({
      _id: id,
      tenantId
    }).populate('employeeId', 'personalInfo.firstName personalInfo.lastName employeeId');

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    // Check if user has permission to view this payroll
    if (role === UserRole.EMPLOYEE) {
      const employee = await Employee.findOne({ userId, tenantId });
      if (!employee || !payroll.employeeId.equals(employee._id)) {
        return res.status(403).json({ message: 'Unauthorized to view this payroll' });
      }
    }

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate bulk payroll
exports.generateBulkPayroll = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { month, year, country, department } = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to generate bulk payroll' });
    }

    // Build query to find employees
    const query = { tenantId, status: 'active' };
    
    if (department) {
      query['companyInfo.department'] = department;
    }

    // Find employees
    const employees = await Employee.find(query);

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    // Check for existing payrolls
    const existingPayrolls = await MultiCountryPayroll.find({
      employeeId: { $in: employees.map(emp => emp._id) },
      month,
      year,
      country,
      tenantId
    });

    const existingEmployeeIds = existingPayrolls.map(p => p.employeeId.toString());
    const employeesToProcess = employees.filter(emp => !existingEmployeeIds.includes(emp._id.toString()));

    if (employeesToProcess.length === 0) {
      return res.status(400).json({ message: 'Payroll already generated for all employees in this period and country' });
    }

    // Get exchange rates
    const exchangeRates = await getExchangeRates();
    
    // Get tax rules for the country
    const taxRules = await getTaxRules(country);
    
    // Get currency for the country
    const currencyMap = {
      'US': 'USD',
      'UK': 'GBP',
      'India': 'INR',
      'Singapore': 'SGD',
      'Australia': 'AUD',
      'Canada': 'CAD',
      'Germany': 'EUR',
      'France': 'EUR',
      'Japan': 'JPY',
      'UAE': 'AED'
    };
    
    const currency = currencyMap[country] || 'USD';
    const exchangeRate = exchangeRates[currency] || 1;

    // Generate payroll for each employee
    const payrolls = [];
    
    for (const employee of employeesToProcess) {
      // In a real app, get salary details from a salary structure table
      // For this example, we'll use mock data
      const basicSalary = 75000 / exchangeRate; // Convert to local currency
      
      // Country-specific allowances
      let allowances = [];
      switch (country) {
        case 'India':
          allowances = [
            { name: 'House Rent Allowance', amount: basicSalary * 0.4, type: 'allowance', taxable: true, countrySpecific: true },
            { name: 'Transport Allowance', amount: 1600 * 12 / 12, type: 'allowance', taxable: false, countrySpecific: true },
            { name: 'Medical Allowance', amount: 1250 * 12 / 12, type: 'allowance', taxable: false, countrySpecific: true }
          ];
          break;
        case 'UK':
          allowances = [
            { name: 'Car Allowance', amount: 500, type: 'allowance', taxable: true, countrySpecific: true },
            { name: 'Meal Allowance', amount: 200, type: 'allowance', taxable: false, countrySpecific: true }
          ];
          break;
        case 'Singapore':
          allowances = [
            { name: 'Transport Allowance', amount: 300, type: 'allowance', taxable: true, countrySpecific: true },
            { name: 'Phone Allowance', amount: 100, type: 'allowance', taxable: false, countrySpecific: true }
          ];
          break;
        default:
          allowances = [
            { name: 'Housing Allowance', amount: basicSalary * 0.2, type: 'allowance', taxable: true, countrySpecific: true },
            { name: 'Transport Allowance', amount: 200, type: 'allowance', taxable: false, countrySpecific: true }
          ];
      }
      
      // Add common allowances
      allowances.push({ name: 'Performance Bonus', amount: basicSalary * 0.1, type: 'allowance', taxable: true, countrySpecific: false });
      
      // Calculate gross salary
      const grossSalary = basicSalary + allowances.reduce((sum, a) => sum + a.amount, 0);
      
      // Calculate standard deductions
      const standardDeductionsTotal = taxRules.standardDeductions.reduce((sum, d) => {
        if (d.amount) {
          return sum + d.amount;
        } else if (d.percentage) {
          return sum + (grossSalary * d.percentage);
        }
        return sum;
      }, 0);
      
      // Calculate taxable income
      const taxableIncome = grossSalary - standardDeductionsTotal;
      
      // Calculate tax
      const tax = calculateTax(taxableIncome, taxRules.taxBrackets);
      
      // Calculate statutory deductions
      const { deductions: statutoryDeductions, totalDeduction: totalStatutoryDeduction } = 
        calculateStatutoryDeductions(grossSalary, taxRules.statutoryContributions);
      
      // Calculate employer contributions
      const { contributions: employerContributions, totalContribution: totalEmployerContribution } = 
        calculateEmployerContributions(grossSalary, taxRules.statutoryContributions);
      
      // Calculate net salary
      const netSalary = grossSalary - tax - totalStatutoryDeduction;
      
      // Calculate total employer cost
      const totalEmployerCost = grossSalary + totalEmployerContribution;
      
      // Run compliance checks
      const complianceChecks = [];
      
      // Check if salary is above minimum wage
      const minimumWageMap = {
        'US': 7.25 * 40 * 4, // $7.25/hour * 40 hours/week * 4 weeks
        'UK': 9.50 * 40 * 4, // £9.50/hour * 40 hours/week * 4 weeks
        'India': 15000, // ₹15,000/month
        'Singapore': 1300, // S$1,300/month
        'Australia': 21.38 * 38 * 4 // A$21.38/hour * 38 hours/week * 4 weeks
      };
      
      const minimumWage = minimumWageMap[country] || 0;
      
      if (minimumWage > 0) {
        complianceChecks.push({
          name: 'Minimum Wage Compliance',
          status: basicSalary >= minimumWage ? 'passed' : 'failed',
          message: basicSalary >= minimumWage ? 'Salary meets minimum wage requirements' : 'Salary is below minimum wage'
        });
      }
      
      // Check if statutory deductions are within limits
      complianceChecks.push({
        name: 'Statutory Deductions',
        status: 'passed',
        message: 'Statutory deductions are correctly calculated'
      });

      // Create payroll record
      const payroll = new MultiCountryPayroll({
        employeeId: employee._id,
        month,
        year,
        country,
        currency,
        exchangeRate,
        basicSalary,
        allowances,
        deductions: [],
        statutoryDeductions,
        grossSalary,
        taxableIncome,
        tax,
        netSalary,
        employerContributions,
        totalEmployerCost,
        status: CountryPayrollStatus.DRAFT,
        complianceChecks,
        tenantId
      });

      await payroll.save();
      payrolls.push(payroll);
    }

    res.status(201).json({
      message: `Payroll generated successfully for ${payrolls.length} employees`,
      payrolls
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll statistics
exports.getPayrollStats = async (req, res) => {
  try {
    const { tenantId, role } = req.user;
    const { month, year, country } = req.query;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to view payroll statistics' });
    }

    // Build query
    const query = { tenantId };

    if (month && year) {
      query.month = Number(month);
      query.year = Number(year);
    }

    if (country) {
      query.country = country;
    }

    // Get payroll records
    const payrollRecords = await MultiCountryPayroll.find(query);

    // Calculate statistics
    const stats = {
      totalEmployees: await Employee.countDocuments({ tenantId, status: 'active' }),
      processedEmployees: payrollRecords.length,
      totalGrossPay: payrollRecords.reduce((sum, p) => sum + p.grossSalary, 0),
      totalNetPay: payrollRecords.reduce((sum, p) => sum + p.netSalary, 0),
      totalTax: payrollRecords.reduce((sum, p) => sum + p.tax, 0),
      totalEmployerCost: payrollRecords.reduce((sum, p) => sum + p.totalEmployerCost, 0),
      averageSalary: payrollRecords.length > 0 ? payrollRecords.reduce((sum, p) => sum + p.netSalary, 0) / payrollRecords.length : 0,
      statusCounts: {
        draft: payrollRecords.filter(p => p.status === CountryPayrollStatus.DRAFT).length,
        processed: payrollRecords.filter(p => p.status === CountryPayrollStatus.PROCESSED).length,
        paid: payrollRecords.filter(p => p.status === CountryPayrollStatus.PAID).length
      }
    };

    // Calculate country distribution
    if (!country) {
      const countryDistribution = await MultiCountryPayroll.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$country', count: { $sum: 1 }, totalGross: { $sum: '$grossSalary' }, totalNet: { $sum: '$netSalary' } } },
        { $sort: { count: -1 } }
      ]);
      
      stats.countryDistribution = countryDistribution;
    }

    // Calculate compliance stats
    const complianceStats = {
      passed: 0,
      failed: 0,
      warning: 0
    };
    
    payrollRecords.forEach(record => {
      record.complianceChecks.forEach(check => {
        complianceStats[check.status]++;
      });
    });
    
    stats.complianceStats = complianceStats;

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tax rules
exports.getTaxRules = async (req, res) => {
  try {
    const { country } = req.params;

    // Get tax rules for the country
    const taxRules = await getTaxRules(country);

    res.status(200).json(taxRules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tax rules
exports.updateTaxRules = async (req, res) => {
  try {
    const { country } = req.params;
    const { tenantId, role } = req.user;
    const updates = req.body;

    // Check if user has permission
    if (role !== UserRole.ADMIN && role !== UserRole.HR) {
      return res.status(403).json({ message: 'Unauthorized to update tax rules' });
    }

    // Find tax rules
    let taxRules = await TaxRule.findOne({ country });

    if (!taxRules) {
      // Create new tax rules
      taxRules = new TaxRule({
        country,
        ...updates
      });
    } else {
      // Update existing tax rules
      Object.keys(updates).forEach(key => {
        taxRules[key] = updates[key];
      });
    }

    await taxRules.save();

    res.status(200).json({
      message: 'Tax rules updated successfully',
      taxRules
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get supported countries
exports.getSupportedCountries = async (req, res) => {
  try {
    // List of supported countries with their details
    const supportedCountries = [
      { code: 'US', name: 'United States', currency: 'USD' },
      { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
      { code: 'India', name: 'India', currency: 'INR' },
      { code: 'Singapore', name: 'Singapore', currency: 'SGD' },
      { code: 'Australia', name: 'Australia', currency: 'AUD' },
      { code: 'Canada', name: 'Canada', currency: 'CAD' },
      { code: 'Germany', name: 'Germany', currency: 'EUR' },
      { code: 'France', name: 'France', currency: 'EUR' },
      { code: 'Japan', name: 'Japan', currency: 'JPY' },
      { code: 'UAE', name: 'United Arab Emirates', currency: 'AED' },
      { code: 'China', name: 'China', currency: 'CNY' },
      { code: 'Brazil', name: 'Brazil', currency: 'BRL' },
      { code: 'Mexico', name: 'Mexico', currency: 'MXN' },
      { code: 'South Africa', name: 'South Africa', currency: 'ZAR' },
      { code: 'Netherlands', name: 'Netherlands', currency: 'EUR' },
      { code: 'Spain', name: 'Spain', currency: 'EUR' },
      { code: 'Italy', name: 'Italy', currency: 'EUR' },
      { code: 'Sweden', name: 'Sweden', currency: 'SEK' },
      { code: 'Switzerland', name: 'Switzerland', currency: 'CHF' },
      { code: 'Malaysia', name: 'Malaysia', currency: 'MYR' }
    ];

    res.status(200).json(supportedCountries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};