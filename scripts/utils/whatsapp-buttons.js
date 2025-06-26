// whatsapp-buttons.js
// WhatsApp country buttons functionality

// WhatsApp base info
const WHATSAPP_PHONE = "525611092568";

export function initWhatsAppCountryButtons() {
  // WhatsApp country button functionality
  $('.countries_button').on('click', function(e) {
    e.preventDefault();
    
    // Get the country name from data attribute
    const country = $(this).attr('data-country');
    let redirectUrl;
    
    // Check if country data attribute is blank
    if (!country || country.trim() === '') {
      // Use the default message when country is blank
      const defaultMessage = "Lola, tell me how you help me money abroad plus, a couple curious facts about you";
      const encodedMessage = encodeURIComponent(defaultMessage);
      redirectUrl = `/redirect?message=${encodedMessage}`;
    } else {
      // Create the message with country-specific text
      const message = `Hi Lola, can you help me send money to ${country} now?`;
      const encodedMessage = encodeURIComponent(message);
      redirectUrl = `/redirect?message=${encodedMessage}`;
    }
    
    // Open redirect page in a new tab
    window.open(redirectUrl, '_blank');
  });
}

// Export the constant for use in other modules if needed
export { WHATSAPP_PHONE };