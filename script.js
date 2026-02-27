// ===========================
// DOM Elements
// ===========================
const dateOfBirthInput = document.getElementById('dateOfBirth');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');
const resultContainer = document.getElementById('resultContainer');
const yearsElement = document.getElementById('years');
const monthsElement = document.getElementById('months');
const daysElement = document.getElementById('days');
const resultText = document.getElementById('resultText');
const darkModeToggle = document.getElementById('darkModeToggle');

// ===========================
// Initialize Dark Mode
// ===========================
/**
 * Initialize dark mode from localStorage on page load
 */
function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
}

/**
 * Updates the dark mode icon based on current theme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
function updateDarkModeIcon(isDarkMode) {
    const icon = darkModeToggle.querySelector('.mode-icon');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
}

// Call initialize on page load
initializeDarkMode();

// ===========================
// Event Listeners
// ===========================
calculateBtn.addEventListener('click', handleCalculateAge);
resetBtn.addEventListener('click', handleReset);
dateOfBirthInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCalculateAge();
    }
});

// Real-time calculation listener
dateOfBirthInput.addEventListener('input', () => {
    // Auto-calculate when date is selected
    if (dateOfBirthInput.value) {
        handleCalculateAge();
    }
});

// Dark mode toggle
darkModeToggle.addEventListener('click', toggleDarkMode);

// ===========================
// Dark Mode Toggle Function
// ===========================
/**
 * Toggles between dark and light mode
 */
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon(isDarkMode);
}

// ===========================
// Main Calculation Function
// ===========================
/**
 * Handles the age calculation process
 * - Validates input
 * - Calculates age
 * - Displays results or errors
 */
function handleCalculateAge() {
    // Clear previous errors
    clearError();
    resultContainer.style.display = 'none';

    // Get input value
    const dateOfBirth = dateOfBirthInput.value;

    // Validate input
    const validation = validateInput(dateOfBirth);
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }

    // Calculate age
    const age = calculateAge(new Date(dateOfBirth));

    // Display results with animation
    displayResults(age);
}

// ===========================
// Validation Function
// ===========================
/**
 * Validates the date input
 * @param {string} dateString - The date input value
 * @returns {object} - Validation result with isValid boolean and message
 */
function validateInput(dateString) {
    // Check if date is selected
    if (!dateString || dateString.trim() === '') {
        return {
            isValid: false,
            message: '⚠️ Please select your date of birth to continue.',
        };
    }

    const dateOfBirth = new Date(dateString);
    const today = new Date();

    // Validate date object
    if (isNaN(dateOfBirth.getTime())) {
        return {
            isValid: false,
            message: '❌ Invalid date format. Please select a valid date.',
        };
    }

    // Check if date is in the future
    if (dateOfBirth > today) {
        return {
            isValid: false,
            message: '❌ Future date is not allowed. Please select a valid date of birth.',
        };
    }

    // Check if date is too old (more than 150 years)
    const maxAge = new Date();
    maxAge.setFullYear(maxAge.getFullYear() - 150);
    if (dateOfBirth < maxAge) {
        return {
            isValid: false,
            message: '❌ Birth date seems too old. Please enter a valid date.',
        };
    }

    return { isValid: true };
}

// ===========================
// Age Calculation Function
// ===========================
/**
 * Calculates exact age in years, months, and days
 * @param {Date} dateOfBirth - The date of birth
 * @returns {object} - Object with years, months, and days
 */
function calculateAge(dateOfBirth) {
    const today = new Date();

    let years = today.getFullYear() - dateOfBirth.getFullYear();
    let months = today.getMonth() - dateOfBirth.getMonth();
    let days = today.getDate() - dateOfBirth.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        // Get the last day of previous month
        const lastDayOfPreviousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ).getDate();
        days += lastDayOfPreviousMonth;
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

// ===========================
// Display Results Function
// ===========================
/**
 * Displays the calculated age in the UI
 * @param {object} age - Object with years, months, and days
 */
function displayResults(age) {
    // Update individual result elements
    yearsElement.textContent = age.years;
    monthsElement.textContent = age.months;
    daysElement.textContent = age.days;

    // Create result text
    const resultString = `You are ${age.years} year${age.years !== 1 ? 's' : ''}, ${age.months} month${age.months !== 1 ? 's' : ''}, and ${age.days} day${age.days !== 1 ? 's' : ''} old.`;
    resultText.textContent = resultString;

    // Show result container with animation
    resultContainer.style.display = 'block';
}

// ===========================
// Error Handling Functions
// ===========================
/**
 * Displays error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

/**
 * Clears error message
 */
function clearError() {
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

// ===========================
// Reset Function
// ===========================
/**
 * Resets the calculator to initial state
 */
function handleReset() {
    // Clear input
    dateOfBirthInput.value = '';
    
    // Clear errors and results
    clearError();
    resultContainer.style.display = 'none';
    
    // Reset result values
    yearsElement.textContent = '0';
    monthsElement.textContent = '0';
    daysElement.textContent = '0';
    resultText.textContent = '';
    
    // Focus on input field
    dateOfBirthInput.focus();
}

// ===========================
// Auto-focus behavior
// ===========================
// Set max date to today for the date input (optional enhancement)
const today = new Date().toISOString().split('T')[0];
dateOfBirthInput.max = today;
