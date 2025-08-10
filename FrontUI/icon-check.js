// Icon Loading Check and Fallback
(function() {
    // Check if Font Awesome loaded properly
    function checkFontAwesome() {
        // Create a test element with a Font Awesome icon
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-user';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        
        // Get the computed style
        const computedStyle = window.getComputedStyle(testElement, ':before');
        const content = computedStyle.getPropertyValue('content');
        
        // Remove test element
        document.body.removeChild(testElement);
        
        // If content is empty or just quotes, Font Awesome didn't load
        if (!content || content === '""' || content === "''") {
            console.warn('Font Awesome failed to load, using fallback icons');
            document.body.classList.add('font-awesome-failed');
            return false;
        }
        
        console.log('Font Awesome loaded successfully');
        return true;
    }
    
    // Run check when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkFontAwesome);
    } else {
        checkFontAwesome();
    }
    
    // Also check after a delay in case it loads late
    setTimeout(checkFontAwesome, 2000);
})(); 