// ===================================
// FORM VALIDATION & MULTI-STEP LOGIC
// ===================================

let currentStep = 1;
const totalSteps = 2;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    initializeMobileStickyCTA();
    initializeCharacterCounter();
});

// ===================================
// FORM INITIALIZATION
// ===================================

function initializeForm() {
    const form = document.getElementById('applicationForm');

    // Add blur validation to all inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        // Clear error on input
        input.addEventListener('input', function () {
            clearFieldError(this);
        });
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Mobile number formatting
    const mobileInput = document.getElementById('mobile');
    mobileInput.addEventListener('input', formatMobileNumber);

    // Add +91 prefix on focus if field is empty
    mobileInput.addEventListener('focus', function () {
        if (this.value === '') {
            this.value = '+91 ';
        }
    });
}

// ===================================
// MULTI-STEP NAVIGATION
// ===================================

function nextStep() {
    if (validateStep(currentStep)) {
        currentStep++;
        updateStepDisplay();
        scrollToTop();
    }
}

function prevStep() {
    currentStep--;
    updateStepDisplay();
    scrollToTop();
}

function updateStepDisplay() {
    // Update form steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update progress indicator
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function scrollToTop() {
    const formSection = document.getElementById('application-form');
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===================================
// FIELD VALIDATION
// ===================================

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const formGroup = field.closest('.form-group');

    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Specific field validations
    if (fieldValue) {
        switch (fieldName) {
            case 'fullName':
                if (fieldValue.length < 3) {
                    isValid = false;
                    errorMessage = 'Please enter your full name (at least 3 characters)';
                }
                break;

            case 'mobile':
                const mobileRegex = /^\+91\s\d{10}$/;
                if (!mobileRegex.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit mobile number';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'location':
                if (fieldValue.length < 3) {
                    isValid = false;
                    errorMessage = 'Please enter your city and state';
                }
                break;

            case 'ageGroup':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Please select your age group';
                }
                break;
        }
    }

    // Display validation result
    if (formGroup) {
        if (isValid && fieldValue) {
            formGroup.classList.remove('has-error');
            field.classList.remove('error');
            field.classList.add('success');
        } else if (!isValid) {
            formGroup.classList.add('has-error');
            field.classList.add('error');
            field.classList.remove('success');
            const errorElement = formGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }
    }

    return isValid;
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
        field.classList.remove('error');
    }
}

// ===================================
// STEP VALIDATION
// ===================================

function validateStep(step) {
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');

    let isStepValid = true;

    inputs.forEach(input => {
        // Special handling for radio buttons
        if (input.type === 'radio') {
            const radioGroup = stepElement.querySelectorAll(`input[name="${input.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);

            if (!isChecked) {
                isStepValid = false;
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('has-error');
                    const errorElement = formGroup.querySelector('.form-error');
                    if (errorElement) {
                        errorElement.textContent = 'Please select an option';
                    }
                }
            }
        }
        // Special handling for checkboxes (both must be checked)
        else if (input.type === 'checkbox' && (input.name === 'smartphone' || input.name === 'internet')) {
            const smartphone = document.getElementById('smartphone');
            const internet = document.getElementById('internet');

            if (!smartphone.checked || !internet.checked) {
                isStepValid = false;
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('has-error');
                    const errorElement = formGroup.querySelector('.form-error');
                    if (errorElement) {
                        errorElement.textContent = 'Both requirements must be met';
                    }
                }
            }
        }
        // Regular validation for other fields
        else if (!validateField(input)) {
            isStepValid = false;
        }
    });

    // Check consent checkbox on step 2
    if (step === 2) {
        const consentCheckbox = document.getElementById('consent');
        if (!consentCheckbox.checked) {
            isStepValid = false;
            alert('Please agree to the consent terms to proceed.');
        }
    }

    return isStepValid;
}

// ===================================
// FORM SUBMISSION
// ===================================

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate final step
    if (!validateStep(currentStep)) {
        return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        ageGroup: document.getElementById('ageGroup').value,
        availability: document.querySelector('input[name="availability"]:checked').value,
        smartphone: document.getElementById('smartphone').checked,
        internet: document.getElementById('internet').checked,
        motivation: document.getElementById('motivation').value,
        consent: document.getElementById('consent').checked,
        timestamp: new Date().toISOString()
    };

    // Simulate API call (replace with actual backend integration)
    setTimeout(() => {
        console.log('Form submitted:', formData);

        // Store data in localStorage for demo purposes
        localStorage.setItem('applicationData', JSON.stringify(formData));

        // Redirect to thank you page
        window.location.href = 'thank-you.html';
    }, 2000);
}

// ===================================
// MOBILE NUMBER FORMATTING
// ===================================

function formatMobileNumber(e) {
    let input = e.target;
    let cursorPosition = input.selectionStart;
    let value = input.value;

    // Extract only digits from the entire value
    let digitsOnly = value.replace(/\D/g, '');

    // Remove any leading "91" that might be from the country code
    // We only want the actual phone number digits
    if (digitsOnly.startsWith('91') && digitsOnly.length > 2) {
        // Keep the 91 prefix, get the rest
        digitsOnly = digitsOnly.substring(2);
    } else if (digitsOnly.startsWith('91')) {
        // If it's just "91", clear it
        digitsOnly = '';
    }

    // Limit to 10 digits maximum
    if (digitsOnly.length > 10) {
        digitsOnly = digitsOnly.substring(0, 10);
    }

    // Build the formatted value
    let formattedValue = '+91 ' + digitsOnly;

    // Update the input value
    input.value = formattedValue;

    // Restore cursor position (after the +91 prefix)
    let newCursorPosition = formattedValue.length;
    if (cursorPosition <= 4) {
        // If cursor was in the prefix area, move it after the prefix
        newCursorPosition = 4;
    }

    setTimeout(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
}

// ===================================
// CHARACTER COUNTER
// ===================================

function initializeCharacterCounter() {
    const motivationField = document.getElementById('motivation');
    const charCounter = document.querySelector('.char-counter');

    if (motivationField && charCounter) {
        motivationField.addEventListener('input', function () {
            const currentLength = this.value.length;
            const maxLength = this.getAttribute('maxlength');
            charCounter.textContent = `${currentLength}/${maxLength}`;
        });
    }
}

// ===================================
// MOBILE STICKY CTA
// ===================================

function initializeMobileStickyCTA() {
    const stickyCta = document.getElementById('stickyCta');
    const formSection = document.getElementById('application-form');

    if (!stickyCta || !formSection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCta.classList.remove('visible');
                } else {
                    stickyCta.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(formSection);
}

// ===================================
// SCROLL TO FORM
// ===================================

function scrollToForm() {
    const formSection = document.getElementById('application-form');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Generate unique application ID
function generateApplicationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `APP-${timestamp}-${random}`;
}

// Format date for display
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-IN', options);
}
