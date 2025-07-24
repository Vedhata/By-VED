// EMI Calculator JavaScript with Futuristic Features

class EMICalculator {
    constructor() {
        this.chart = null;
        this.recognition = null;
        this.synthesis = null;
        this.initializeElements();
        this.bindEvents();
        this.setupValidation();
        this.initializeTheme();
        this.initializeVoice();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById("emiForm");
        this.loanAmountInput = document.getElementById("loanAmount");
        this.interestRateInput = document.getElementById("interestRate");
        this.loanTenureInput = document.getElementById("loanTenure");
        this.tenureTypeSelect = document.getElementById("tenureType");
        this.resetBtn = document.getElementById("resetBtn");

        // Result elements
        this.resultsSection = document.getElementById("resultsSection");
        this.monthlyEMIElement = document.getElementById("monthlyEMI");
        this.totalInterestElement = document.getElementById("totalInterest");
        this.totalAmountElement = document.getElementById("totalAmount");

        // Table elements
        this.monthlyTableBody = document.getElementById("monthlyTableBody");
        this.yearlyTableBody = document.getElementById("yearlyTableBody");

        // Tab elements
        this.tabButtons = document.querySelectorAll(".tab-btn");
        this.tabContents = document.querySelectorAll(".tab-content");

        // Theme elements
        this.themeToggle = document.getElementById("themeToggle");

        // Voice elements
        this.voiceBtn = document.getElementById("voiceBtn");
        this.voiceModal = document.getElementById("voiceModal");
        this.voiceStatus = document.getElementById("voiceStatus");
        this.stopVoiceBtn = document.getElementById("stopVoice");

        // Chart element
        this.chartCanvas = document.getElementById("amortizationChart");
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.calculateEMI();
        });

        // Reset button
        this.resetBtn.addEventListener("click", () => {
            this.resetForm();
        });

        // Real-time calculation on input change
        [this.loanAmountInput, this.interestRateInput, this.loanTenureInput, this.tenureTypeSelect].forEach(input => {
            input.addEventListener("input", () => {
                if (this.validateInputs()) {
                    this.calculateEMI();
                }
            });
        });

        // Tab switching
        this.tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.switchTab(button.dataset.tab);
            });
        });

        // Theme toggle
        this.themeToggle.addEventListener("click", () => {
            this.toggleTheme();
        });

        // Voice events
        this.voiceBtn.addEventListener("click", () => {
            this.startVoiceInput();
        });

        this.stopVoiceBtn.addEventListener("click", () => {
            this.stopVoiceInput();
        });

        // Close voice modal on outside click
        this.voiceModal.addEventListener("click", (e) => {
            if (e.target === this.voiceModal) {
                this.stopVoiceInput();
            }
        });
    }

    setupValidation() {
        // Add input validation and formatting
        this.loanAmountInput.addEventListener("blur", () => {
            let value = this.loanAmountInput.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot
            if (value === "") {
                this.loanAmountInput.value = ""; // Keep it blank if nothing was entered
                return;
            }
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                this.loanAmountInput.value = numericValue.toLocaleString("en-IN");
            } else {
                this.loanAmountInput.value = ""; // Clear if invalid number
            }
        });

        this.loanAmountInput.addEventListener("input", () => {
            let inputValue = this.loanAmountInput.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot
            const parts = inputValue.split(".");
            if (parts.length > 2) {
                inputValue = parts[0] + "." + parts.slice(1).join("");
            }
            
            // Format with commas as user types
            const numericValue = parseFloat(inputValue.replace(/,/g, ""));
            if (!isNaN(numericValue)) {
                this.loanAmountInput.value = numericValue.toLocaleString("en-IN");
            } else {
                this.loanAmountInput.value = inputValue; // Keep raw input if not a valid number yet
            }
        });

        this.interestRateInput.addEventListener("blur", () => {
            this.formatPercentage(this.interestRateInput);
        });
    }

    initializeTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    initializeVoice() {
        // Check for Web Speech API support
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.processVoiceInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.voiceStatus.textContent = 'Error: ' + event.error;
                setTimeout(() => this.stopVoiceInput(), 2000);
            };

            this.recognition.onend = () => {
                this.stopVoiceInput();
            };
        } else {
            this.voiceBtn.disabled = true;
            this.voiceBtn.title = 'Voice input not supported in this browser';
        }

        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }

        // Update chart if it exists
        if (this.chart) {
            this.updateChartTheme();
        }
    }

    startVoiceInput() {
        if (this.recognition) {
            this.voiceModal.style.display = 'flex';
            this.voiceStatus.textContent = 'Listening... Say your loan details';
            this.recognition.start();
        }
    }

    stopVoiceInput() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.voiceModal.style.display = 'none';
    }

    processVoiceInput(transcript) {
        this.voiceStatus.textContent = 'Processing: "' + transcript + '"';
        
        // Extract numbers from transcript
        const numbers = transcript.match(/\d+(?:\.\d+)?/g);
        
        if (numbers && numbers.length >= 3) {
            // Assume order: loan amount, interest rate, tenure
            this.loanAmountInput.value = numbers[0];
            this.interestRateInput.value = numbers[1];
            this.loanTenureInput.value = numbers[2];
            
            // Check for tenure type
            if (transcript.includes('month')) {
                this.tenureTypeSelect.value = 'months';
            } else {
                this.tenureTypeSelect.value = 'years';
            }
            
            this.voiceStatus.textContent = 'Values set successfully!';
            
            // Calculate EMI after a short delay
            setTimeout(() => {
                this.calculateEMI();
                this.stopVoiceInput();
            }, 1500);
        } else {
            this.voiceStatus.textContent = 'Please provide loan amount, interest rate, and tenure';
            setTimeout(() => this.stopVoiceInput(), 2000);
        }
    }

    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            this.synthesis.speak(utterance);
        }
    }

    validateInputs() {
        const loanAmount = parseFloat(this.loanAmountInput.value.replace(/,/g, ""));
        const interestRate = parseFloat(this.interestRateInput.value);
        const loanTenure = parseFloat(this.loanTenureInput.value);

        return loanAmount > 0 && interestRate > 0 && loanTenure > 0;
    }

    calculateEMI() {
        if (!this.validateInputs()) {
            return;
        }

        const loanAmount = parseFloat(this.loanAmountInput.value.replace(/,/g, ""));
        const annualRate = parseFloat(this.interestRateInput.value);
        const tenure = parseFloat(this.loanTenureInput.value);
        const tenureType = this.tenureTypeSelect.value;

        // Convert to months if needed
        const tenureInMonths = tenureType === "years" ? tenure * 12 : tenure;
        const monthlyRate = annualRate / 12 / 100;

        // EMI calculation using the standard formula
        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) / 
                   (Math.pow(1 + monthlyRate, tenureInMonths) - 1);

        const totalAmount = emi * tenureInMonths;
        const totalInterest = totalAmount - loanAmount;

        // Update result displays
        this.updateResults(emi, totalInterest, totalAmount);

        // Generate amortization schedule
        const schedule = this.generateAmortizationSchedule(loanAmount, emi, monthlyRate, tenureInMonths);
        
        // Update tables
        this.updateMonthlyTable(schedule);
        this.updateYearlyTable(schedule);

        // Update chart
        this.updateChart(schedule);

        // Show results section
        this.resultsSection.style.display = "block";
        this.resultsSection.scrollIntoView({ behavior: "smooth" });

        // Speak results if voice was used
        if (this.voiceModal.style.display === 'flex') {
            const resultText = `Your monthly EMI is ${this.formatCurrencyValue(emi)} rupees. Total interest is ${this.formatCurrencyValue(totalInterest)} rupees.`;
            this.speak(resultText);
        }
    }

    updateResults(emi, totalInterest, totalAmount) {
        this.monthlyEMIElement.textContent = this.formatCurrencyValue(emi);
        this.totalInterestElement.textContent = this.formatCurrencyValue(totalInterest);
        this.totalAmountElement.textContent = this.formatCurrencyValue(totalAmount);

        // Add animation to result cards
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
            }, 10);
        });
    }

    generateAmortizationSchedule(principal, emi, monthlyRate, tenure) {
        const schedule = [];
        let remainingBalance = principal;

        for (let month = 1; month <= tenure; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = emi - interestPayment;
            remainingBalance -= principalPayment;

            // Ensure remaining balance doesn't go negative due to rounding
            if (remainingBalance < 0) remainingBalance = 0;

            schedule.push({
                month,
                openingBalance: remainingBalance + principalPayment,
                emi,
                principal: principalPayment,
                interest: interestPayment,
                closingBalance: remainingBalance
            });
        }

        return schedule;
    }

    updateMonthlyTable(schedule) {
        this.monthlyTableBody.innerHTML = "";
        
        schedule.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.month}</td>
                <td>₹${this.formatNumber(row.openingBalance)}</td>
                <td>₹${this.formatNumber(row.emi)}</td>
                <td>₹${this.formatNumber(row.principal)}</td>
                <td>₹${this.formatNumber(row.interest)}</td>
                <td>₹${this.formatNumber(row.closingBalance)}</td>
            `;
            this.monthlyTableBody.appendChild(tr);
        });
    }

    updateYearlyTable(schedule) {
        this.yearlyTableBody.innerHTML = "";
        
        const yearlyData = [];
        let currentYear = 1;
        let yearlyEMI = 0;
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;

        schedule.forEach((row, index) => {
            yearlyEMI += row.emi;
            yearlyPrincipal += row.principal;
            yearlyInterest += row.interest;

            // If it's the end of a year or the last month
            if ((index + 1) % 12 === 0 || index === schedule.length - 1) {
                yearlyData.push({
                    year: currentYear,
                    totalEMI: yearlyEMI,
                    principalPaid: yearlyPrincipal,
                    interestPaid: yearlyInterest,
                    remainingBalance: row.closingBalance
                });

                currentYear++;
                yearlyEMI = 0;
                yearlyPrincipal = 0;
                yearlyInterest = 0;
            }
        });

        yearlyData.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.year}</td>
                <td>₹${this.formatNumber(row.totalEMI)}</td>
                <td>₹${this.formatNumber(row.principalPaid)}</td>
                <td>₹${this.formatNumber(row.interestPaid)}</td>
                <td>₹${this.formatNumber(row.remainingBalance)}</td>
            `;
            this.yearlyTableBody.appendChild(tr);
        });
    }

    updateChart(schedule) {
        const ctx = this.chartCanvas.getContext('2d');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Prepare data for chart (show every 12th month for better readability)
        const labels = [];
        const principalData = [];
        const interestData = [];
        
        schedule.forEach((row, index) => {
            if (index % 12 === 0 || index === schedule.length - 1) {
                labels.push(`Month ${row.month}`);
                principalData.push(row.principal);
                interestData.push(row.interest);
            }
        });

        // Get theme colors
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#e0e6ed' : '#333';
        const gridColor = isDark ? 'rgba(100, 255, 218, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal Payment',
                        data: principalData,
                        backgroundColor: 'rgba(100, 255, 218, 0.8)',
                        borderColor: 'rgba(100, 255, 218, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Interest Payment',
                        data: interestData,
                        backgroundColor: 'rgba(255, 171, 0, 0.8)',
                        borderColor: 'rgba(255, 171, 0, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Principal vs Interest Payment Over Time',
                        color: textColor,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    updateChartTheme() {
        if (this.chart) {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#e0e6ed' : '#333';
            const gridColor = isDark ? 'rgba(100, 255, 218, 0.1)' : 'rgba(0, 0, 0, 0.1)';

            this.chart.options.plugins.title.color = textColor;
            this.chart.options.plugins.legend.labels.color = textColor;
            this.chart.options.scales.x.ticks.color = textColor;
            this.chart.options.scales.x.grid.color = gridColor;
            this.chart.options.scales.y.ticks.color = textColor;
            this.chart.options.scales.y.grid.color = gridColor;
            
            this.chart.update();
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and contents
        this.tabButtons.forEach(btn => btn.classList.remove("active"));
        this.tabContents.forEach(content => content.classList.remove("active"));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
        document.getElementById(`${tabName}Tab`).classList.add("active");
    }

    resetForm() {
        this.form.reset();
        this.resultsSection.style.display = "none";
        
        // Destroy chart
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Reset to monthly tab
        this.switchTab("monthly");

        // Add reset animation
        const formContainer = document.querySelector('.form-container');
        formContainer.style.animation = 'none';
        setTimeout(() => {
            formContainer.style.animation = 'fadeInLeft 0.5s ease-out';
        }, 10);
    }

    formatCurrency(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            input.value = value.toLocaleString('en-IN');
        }
    }

    formatPercentage(input) {
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            input.value = value.toFixed(2);
        }
    }

    formatNumber(number) {
        return Math.round(number).toLocaleString('en-IN');
    }

    formatCurrencyValue(number) {
        return '₹' + Math.round(number).toLocaleString('en-IN');
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new EMICalculator();
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});


// Advanced Voice Features and Accessibility Enhancements

// Voice Commands Handler
class VoiceCommandHandler {
    constructor(calculator) {
        this.calculator = calculator;
        this.commands = {
            'calculate': () => this.calculator.calculateEMI(),
            'reset': () => this.calculator.resetForm(),
            'dark mode': () => this.calculator.toggleTheme(),
            'light mode': () => this.calculator.toggleTheme(),
            'monthly breakdown': () => this.calculator.switchTab('monthly'),
            'yearly breakdown': () => this.calculator.switchTab('yearly'),
            'speak results': () => this.speakCurrentResults()
        };
    }

    processCommand(transcript) {
        const command = transcript.toLowerCase().trim();
        
        // Check for direct commands
        for (const [key, action] of Object.entries(this.commands)) {
            if (command.includes(key)) {
                action();
                return true;
            }
        }

        // Check for loan amount setting
        if (command.includes('loan amount') || command.includes('principal')) {
            const amount = this.extractNumber(command);
            if (amount) {
                this.calculator.loanAmountInput.value = amount;
                this.calculator.speak(`Loan amount set to ${amount} rupees`);
                return true;
            }
        }

        // Check for interest rate setting
        if (command.includes('interest rate') || command.includes('rate')) {
            const rate = this.extractNumber(command);
            if (rate) {
                this.calculator.interestRateInput.value = rate;
                this.calculator.speak(`Interest rate set to ${rate} percent`);
                return true;
            }
        }

        // Check for tenure setting
        if (command.includes('tenure') || command.includes('period')) {
            const tenure = this.extractNumber(command);
            if (tenure) {
                this.calculator.loanTenureInput.value = tenure;
                const type = command.includes('month') ? 'months' : 'years';
                this.calculator.tenureTypeSelect.value = type;
                this.calculator.speak(`Tenure set to ${tenure} ${type}`);
                return true;
            }
        }

        return false;
    }

    extractNumber(text) {
        const match = text.match(/\d+(?:\.\d+)?/);
        return match ? parseFloat(match[0]) : null;
    }

    speakCurrentResults() {
        const emi = this.calculator.monthlyEMIElement.textContent;
        const totalInterest = this.calculator.totalInterestElement.textContent;
        const totalAmount = this.calculator.totalAmountElement.textContent;
        
        if (emi !== '₹0') {
            const resultText = `Your monthly EMI is ${emi}. Total interest is ${totalInterest}. Total amount payable is ${totalAmount}.`;
            this.calculator.speak(resultText);
        } else {
            this.calculator.speak('Please calculate EMI first by entering loan details.');
        }
    }
}

// Accessibility Features
class AccessibilityEnhancer {
    constructor() {
        this.initializeKeyboardNavigation();
        this.initializeScreenReaderSupport();
        this.initializeFocusManagement();
    }

    initializeKeyboardNavigation() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + Enter to calculate
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                document.querySelector('.btn-calculate').click();
            }
            
            // Ctrl + R to reset
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                document.querySelector('.btn-reset').click();
            }
            
            // Ctrl + D to toggle dark mode
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                document.getElementById('themeToggle').click();
            }
            
            // Ctrl + V for voice input
            if (e.ctrlKey && e.key === 'v') {
                e.preventDefault();
                document.getElementById('voiceBtn').click();
            }
        });
    }

    initializeScreenReaderSupport() {
        // Add ARIA labels and descriptions
        const inputs = document.querySelectorAll('input, select, button');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    input.setAttribute('aria-labelledby', label.id || 'label-' + Math.random().toString(36).substr(2, 9));
                }
            }
        });

        // Add live region for results
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.setAttribute('aria-live', 'polite');
        resultsSection.setAttribute('aria-label', 'EMI calculation results');
    }

    initializeFocusManagement() {
        // Improve focus visibility
        const focusableElements = document.querySelectorAll('input, button, select, a, [tabindex]');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '3px solid var(--text-accent)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
}

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.initializeLazyLoading();
        this.initializeDebouncing();
    }

    initializeLazyLoading() {
        // Lazy load chart library only when needed
        let chartLoaded = false;
        
        const originalCalculateEMI = EMICalculator.prototype.calculateEMI;
        EMICalculator.prototype.calculateEMI = function() {
            if (!chartLoaded && typeof Chart === 'undefined') {
                // Chart.js is already loaded in HTML, but this is for future optimization
                chartLoaded = true;
            }
            originalCalculateEMI.call(this);
        };
    }

    initializeDebouncing() {
        // Debounce real-time calculations
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Apply debouncing to input events
        const inputs = document.querySelectorAll('#loanAmount, #interestRate, #loanTenure');
        inputs.forEach(input => {
            const originalHandler = input.oninput;
            if (originalHandler) {
                input.oninput = debounce(originalHandler, 300);
            }
        });
    }
}

// Enhanced EMI Calculator with Voice Commands
const originalEMICalculator = EMICalculator;
EMICalculator = class extends originalEMICalculator {
    constructor() {
        super();
        this.voiceCommandHandler = new VoiceCommandHandler(this);
        this.accessibilityEnhancer = new AccessibilityEnhancer();
        this.performanceOptimizer = new PerformanceOptimizer();
        this.initializeAdvancedFeatures();
    }

    initializeAdvancedFeatures() {
        // Enhanced voice recognition with command processing
        if (this.recognition) {
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.voiceStatus.textContent = `Processing: "${transcript}"`;
                
                // Try to process as command first
                if (this.voiceCommandHandler.processCommand(transcript)) {
                    this.voiceStatus.textContent = 'Command executed successfully!';
                    setTimeout(() => this.stopVoiceInput(), 1500);
                } else {
                    // Fall back to original voice input processing
                    this.processVoiceInput(transcript);
                }
            };
        }

        // Add tooltips for better UX
        this.addTooltips();
        
        // Add progress indicators
        this.addProgressIndicators();
    }

    addTooltips() {
        const tooltips = {
            'loanAmount': 'Enter the total loan amount you want to borrow',
            'interestRate': 'Enter the annual interest rate offered by the lender',
            'loanTenure': 'Enter the loan repayment period',
            'themeToggle': 'Switch between light and dark themes',
            'voiceBtn': 'Use voice commands to input loan details'
        };

        Object.entries(tooltips).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('title', text);
                element.setAttribute('aria-description', text);
            }
        });
    }

    addProgressIndicators() {
        // Add loading state to calculate button
        const calculateBtn = document.querySelector('.btn-calculate');
        const originalCalculate = this.calculateEMI.bind(this);
        
        this.calculateEMI = function() {
            calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
            calculateBtn.disabled = true;
            
            setTimeout(() => {
                originalCalculate();
                calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate EMI';
                calculateBtn.disabled = false;
            }, 500);
        };
    }

    // Enhanced speak method with better voice options
    speak(text, options = {}) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.rate || 0.8;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;
            
            // Try to use a more natural voice
            const voices = this.synthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.lang.includes('en') && voice.name.includes('Google')
            ) || voices.find(voice => voice.lang.includes('en'));
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }
};

// Add service worker for offline functionality (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration would go here
        console.log('EMI Calculator ready for offline functionality');
    });
}

// Add error handling and user feedback
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: var(--shadow-heavy);
    `;
    errorDiv.textContent = 'An error occurred. Please refresh the page.';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
});

// Add analytics tracking (placeholder for future implementation)
class AnalyticsTracker {
    static trackEvent(category, action, label) {
        // Placeholder for analytics implementation
        console.log(`Analytics: ${category} - ${action} - ${label}`);
    }
    
    static trackCalculation(loanAmount, interestRate, tenure) {
        this.trackEvent('EMI', 'Calculate', `${loanAmount}-${interestRate}-${tenure}`);
    }
    
    static trackVoiceUsage() {
        this.trackEvent('Voice', 'Used', 'Voice Input');
    }
    
    static trackThemeChange(theme) {
        this.trackEvent('Theme', 'Changed', theme);
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMICalculator, VoiceCommandHandler, AccessibilityEnhancer };
}
