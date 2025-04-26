document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    // Form elements
    const fullName = document.getElementById('fullName');
    const contactEmail = document.getElementById('contactEmail');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    // Form validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    sendMessageBtn.addEventListener('click', function() {
        // Clear any existing messages
        clearFormMessages();
        
        // Validate form
        let isValid = true;
        
        // Required field validation
        if (!fullName.value.trim()) {
            showFieldError(fullName, 'Please enter your name');
            isValid = false;
        }
        
        if (!contactEmail.value.trim()) {
            showFieldError(contactEmail, 'Please enter your email address');
            isValid = false;
        } else if (!emailPattern.test(contactEmail.value.trim())) {
            showFieldError(contactEmail, 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showFieldError(message, 'Please enter your message');
            isValid = false;
        }
        
        // If form is valid, proceed with submission
        if (isValid) {
            // Add loading state to button
            sendMessageBtn.disabled = true;
            sendMessageBtn.innerText = 'Sending...';
            
            // Construct the mailto link
            const subjectText = subject.value.trim() 
                ? subject.value.trim() 
                : `Contact from ${fullName.value.trim()}`;
                
            const mailSubject = encodeURIComponent(subjectText);
            const mailBody = encodeURIComponent(
                `Name: ${fullName.value.trim()}\n` +
                `Email: ${contactEmail.value.trim()}\n\n` +
                `Message:\n${message.value.trim()}`
            );
            
            const mailtoLink = `mailto:support@rknplayer.com?subject=${mailSubject}&body=${mailBody}`;
            
            // Simulate a slight delay for a better user experience
            setTimeout(() => {
                // Open the user's email client
                window.location.href = mailtoLink;
                
                // Show success message
                showFormMessage('Your message has been prepared. Please send it through your email client.', 'success');
                
                // Reset the form
                contactForm.reset();
                
                // Reset button state
                sendMessageBtn.disabled = false;
                sendMessageBtn.innerText = 'Send Message';
            }, 800);
        }
    });
    
    // Add input event listeners to clear errors on typing
    const formFields = [fullName, contactEmail, message];
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            this.classList.remove('error');
            const errorElement = this.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    });
    
    // Helper function to show field-specific errors
    function showFieldError(field, errorMessage) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#FF6B6B';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        
        field.parentElement.appendChild(errorElement);
    }
    
    // Helper function to show form-wide messages
    function showFormMessage(messageText, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = messageText;
        
        // Insert before the submit button
        contactForm.insertBefore(messageElement, sendMessageBtn.parentElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 300);
        }, 5000);
    }
    
    // Helper function to clear all form messages
    function clearFormMessages() {
        // Clear field errors
        const fieldErrors = contactForm.querySelectorAll('.field-error');
        fieldErrors.forEach(error => error.remove());
        
        // Clear form-wide messages
        const formMessages = contactForm.querySelectorAll('.form-message');
        formMessages.forEach(message => message.remove());
        
        // Clear error classes
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => input.classList.remove('error'));
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #FF6B6B !important;
        }
        
        .form-message {
            animation: fadeIn 0.3s ease;
        }
        
        .form-message.fade-out {
            animation: fadeOut 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});