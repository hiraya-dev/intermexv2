// whatsapp-interface.js
// WhatsApp interface functionality with API integration

// Country data for API requests
const countryData = [
    {
      "srcAmount": 100,
      "dstCountry": "MEXICO",
      "statePayer": "JALISCO",
      "cityPayer": "GUADALAJARA",
      "srcCurrency": "USD",
      "dstCurrency": "MXN",
      "transactionType": 1,
      "payerCode": "MX-0144",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "COLOMBIA",
      "statePayer": "ANTIOQUIA",
      "cityPayer": "MEDELLIN",
      "srcCurrency": "USD",
      "dstCurrency": "COP",
      "transactionType": 1,
      "payerCode": "CL-0023",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "BRASIL",
      "statePayer": "",
      "cityPayer": "",
      "srcCurrency": "USD",
      "dstCurrency": "BRL",
      "transactionType": 1,
      "payerCode": "",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "ARGENTINA",
      "statePayer": "BUENOS AIRES",
      "cityPayer": "BUENOS AIRES",
      "srcCurrency": "USD",
      "dstCurrency": "ARS",
      "transactionType": 1,
      "payerCode": "AR-03",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "GUATEMALA",
      "statePayer": "GUATEMALA",
      "cityPayer": "GUATEMALA",
      "srcCurrency": "USD",
      "dstCurrency": "GTQ",
      "transactionType": 1,
      "payerCode": "GU-0031",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "BOLIVIA",
      "statePayer": "LA PAZ",
      "cityPayer": "LA PAZ",
      "srcCurrency": "USD",
      "dstCurrency": "BOB",
      "transactionType": 1,
      "payerCode": "BO-0005",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "HONDURAS",
      "statePayer": "",
      "cityPayer": "",
      "srcCurrency": "USD",
      "dstCurrency": "HNL",
      "transactionType": 1,
      "payerCode": "",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "NICARAGUA",
      "statePayer": "GRANADA",
      "cityPayer": "GRANADA",
      "srcCurrency": "USD",
      "dstCurrency": "NIO",
      "transactionType": 1,
      "payerCode": "",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "REPUBLICA DOMINICANA",
      "statePayer": "DISTRITO NACIONAL",
      "cityPayer": "DISTRITO NACIONAL",
      "srcCurrency": "USD",
      "dstCurrency": "DOP",
      "transactionType": 1,
      "payerCode": "RP-0013",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "PERU",
      "statePayer": "LIMA",
      "cityPayer": "LIMA",
      "srcCurrency": "USD",
      "dstCurrency": "PEN",
      "transactionType": 1,
      "payerCode": "PE-0022",
      "deliveryTypeId": "D"
    },
    {
      "srcAmount": 100,
      "dstCountry": "EUROPE",
      "statePayer": "",
      "cityPayer": "",
      "srcCurrency": "USD",
      "dstCurrency": "EUR",
      "transactionType": 1,
      "payerCode": "",
      "deliveryTypeId": "D"
    }
  ];
  
  // Currency to country name mapping
  const countryNames = {
    "MXN": "Mexico",
    "COP": "Colombia",
    "PEN": "Peru",
    "EUR": "Europe",
    "BRL": "Brazil",
    "ARS": "Argentina",
    "GTQ": "Guatemala",
    "BOB": "Bolivia",
    "HNL": "Honduras",
    "NIO": "Nicaragua",
    "DOP": "Dominican Republic"
  };
  
  // API endpoint
  const API_URL = "https://lolaversys-dev.up.railway.app/payhub/quote";
  
  export function initWhatsAppInterface() {
    // Get the target form using a more precise selector
    const targetForm = $('#whatsapp-conversion');
    
    // Log to verify the form exists
    console.log('Form found:', targetForm.length);
    
    // Only proceed if we find the target form
    if (targetForm.length === 0) {
      console.log('Form whatsapp-conversion not found');
      return;
    }
    
    // Disable form submission
    targetForm.attr('onsubmit', 'return false;');
    
    // Get form elements with updated selectors
    const countrySelect = targetForm.find('#country-select');
    const amountInput = targetForm.find('#amount');
    const submitButton = targetForm.find('.whatsapp_submit');
    
    // Log to verify elements exist
    console.log('Country select found:', countrySelect.length);
    console.log('Amount input found:', amountInput.length);
    console.log('Submit button found:', submitButton.length);
    
    let messagesShown = false;
    let isLoading = false;
    
    // Function to update WhatsApp URL with form values
    function updateWhatsAppUrl() {
      const amount = amountInput.val() ? parseFloat(amountInput.val()).toFixed(2) : "0.00";
      const currencyCode = countrySelect.val();
      const country = currencyCode ? countryNames[currencyCode] : "";
    
      // Create the message
      const message = `Hi Lola, can you help me send $${amount} to ${country} now?`;
      const encodedMessage = encodeURIComponent(message);
    
      // Use redirect URL instead of direct WhatsApp link
      const redirectUrl = `/redirect?message=${encodedMessage}`;
    
      // Update the header CTA link with the new redirect URL
      $('#ctaLink').attr({
        'href': redirectUrl,
        'target': '_blank',
        'rel': 'noopener noreferrer'
      });
    }
    
    // Update WhatsApp URL when form values change
    amountInput.on('input change', updateWhatsAppUrl);
    countrySelect.on('change', updateWhatsAppUrl);
    
    // Initialize WhatsApp URL with default values
    updateWhatsAppUrl();
    
    // Set initial scroll position for the chat box
    function setInitialScroll() {
      const chatBox = $('#interfaceChatBox');
      if (chatBox.length) {
        // Only set initial scroll if the chat box exists and has content
        const scrollHeight = chatBox[0].scrollHeight;
        chatBox.scrollTop(scrollHeight);
      }
    }
    
    // Call this after page load
    $(document).ready(function () {
      setInitialScroll();
    });
    
    // Replace any existing click handler with a more forceful approach
    $('#ctaLink').off('click').on('click', function (e) {
      // Only prevent default if we're going to handle it ourselves
      e.preventDefault();
    
      // Get the current href (with updated query parameters)
      const url = $(this).attr('href');
    
      // Force open in new tab/window
      const newWindow = window.open(url, '_blank');
    
      // If popup was blocked, try to focus the window
      if (newWindow) {
        newWindow.focus();
      } else {
        // If window.open failed (possibly due to popup blocker), alert user
        console.warn(
          'Popup blocker may be preventing opening the redirect page. Please allow popups for this site.'
        );
      }
    
      return false; // Extra measure to prevent default action
    });
    
    // Add loading state flag without changing button appearance
    function setLoading(loading) {
      isLoading = loading;
      if (loading) {
        submitButton.addClass('processing');
      } else {
        submitButton.removeClass('processing');
      }
    }
    
    // Function to show tooltip error - UPDATED with better selector checks
    function showTooltipError(message, targetElement) {
      // Only show tooltip for elements within our target form
      if (!targetElement.closest('#whatsapp-conversion').length) {
        console.log('Tooltip prevented: Element not in target form');
        return;
      }
    
      // Remove any existing tooltip
      $('.validation-tooltip').remove();
    
      // Create tooltip element
      const tooltip = $(`<div class="validation-tooltip">${message}</div>`);
      $('body').append(tooltip);
    
      // Position tooltip near the target element
      const targetPosition = targetElement.offset();
      const targetHeight = targetElement.outerHeight();
    
      tooltip.css({
        'position': 'absolute',
        'top': targetPosition.top + targetHeight + 5 + 'px',
        'left': targetPosition.left + 'px',
        'background-color': '#FF4136',
        'color': 'white',
        'padding': '5px 10px',
        'border-radius': '4px',
        'font-size': '14px',
        'z-index': '1000',
        'box-shadow': '0 2px 5px rgba(0,0,0,0.2)'
      });
    
      // Add arrow to tooltip
      tooltip.append('<div class="tooltip-arrow"></div>');
      $('.tooltip-arrow').css({
        'position': 'absolute',
        'top': '-6px',
        'left': '10px',
        'width': '0',
        'height': '0',
        'border-left': '6px solid transparent',
        'border-right': '6px solid transparent',
        'border-bottom': '6px solid #FF4136'
      });
    
      // Add a data attribute to mark which form this tooltip belongs to
      tooltip.attr('data-form', 'whatsapp-conversion');
    
      // Auto-hide tooltip after 3 seconds
      setTimeout(function () {
        tooltip.fadeOut(300, function () {
          $(this).remove();
        });
      }, 3000);
    }
    
    // Handle submit button click - UPDATED with better debugging and selector checks
    submitButton.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
    
      console.log('Submit button clicked');
    
      // Make sure we're only handling clicks on the target form
      if (!$(this).closest('#whatsapp-conversion').length) {
        console.log('Submit prevented: Button not in target form');
        return true; // Allow other forms to process normally
      }
    
      // Prevent double submission
      if (messagesShown || isLoading) {
        console.log('Submit prevented: Already processing or messages shown');
        return false;
      }
    
      // Get values for calculation
      const currencyCode = countrySelect.val();
      const amount = parseFloat(amountInput.val());
    
      console.log('Currency:', currencyCode, 'Amount:', amount);
    
      // Validation with tooltip
      if (!currencyCode) {
        showTooltipError('Please select a country', countrySelect);
        return false;
      } else if (isNaN(amount) || amount <= 0) {
        showTooltipError('Please enter a valid amount', amountInput);
        return false;
      }
    
      // Set loading state
      setLoading(true);
    
      // Find the country data for the selected currency
      const selectedCountryData = countryData.find(item => item.dstCurrency === currencyCode);
    
      if (!selectedCountryData) {
        console.error('Country data not found for currency:', currencyCode);
        setLoading(false);
        return false;
      }
    
      // Prepare API payload
      const payload = {
        srcAmount: amount,
        dstCountry: selectedCountryData.dstCountry,
        statePayer: selectedCountryData.statePayer,
        cityPayer: selectedCountryData.cityPayer,
        srcCurrency: "USD",
        dstCurrency: currencyCode,
        transactionType: selectedCountryData.transactionType,
        payerCode: selectedCountryData.payerCode,
        deliveryTypeId: selectedCountryData.deliveryTypeId
      };
    
      console.log('API payload:', payload);
    
      // Make API request for exchange rate calculation
      $.ajax({
        url: API_URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (response) {
          console.log('API response:', response);
    
          // Get the exchange rate and total from the response
          const totalReceived = response.dstAmount.toFixed(2);
          const formattedTotal = totalReceived.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
          // Use the exchangeRate directly from the API response instead of calculating it
          const rate = response.exchangeRate ? response.exchangeRate.toFixed(2) : "NaN";
    
          // Get the fee from response (or default to 0 if not available)
          const fee = "0";
    
          // Get country name
          const country = countryNames[currencyCode];
    
          // Create messages
          const senderMessage = `Hi Lola, can you help me send ${amount.toFixed(2)} USD to ${country} now?`;
          const responseMessage = `If you send ${amount.toFixed(2)} USD, your recipient will get <span class="text-weight-bold">${formattedTotal} ${currencyCode}</span>. The estimated exchange rate is <span class="text-weight-bold">${rate} ${currencyCode}</span> per <span class="text-weight-bold">1.00 USD</span>.`;
    
          // Create HTML for bubbles with dynamic fee
          createAndAnimateMessageBubbles(senderMessage, responseMessage, fee);
    
          // Update the CTA link with final values before showing it
          updateWhatsAppUrl();
    
          messagesShown = true;
          setLoading(false);
        },
        error: function (error) {
          console.error('API Error:', error);
    
          // Fallback to static rates if API fails
          alert('There was an error calculating the exchange rate. Please try again later.');
          setLoading(false);
        }
      });
    
      return false;
    });
    
    // Function to scroll to a specific message
    function scrollToMessage(messageSelector) {
      const chatBox = $('#interfaceChatBox');
      const message = $(messageSelector);
    
      if (message.length) {
        // Get the position of the message relative to the chatBox
        const messagePosition = message.position().top + chatBox.scrollTop();
        // Calculate target scroll position to show the message properly
        const targetScroll = messagePosition - 20; // 20px padding from top
    
        // Animate the scroll
        chatBox.animate({
          scrollTop: targetScroll
        }, 300);
      }
    }
    
    // Function to create and animate message bubbles
    function createAndAnimateMessageBubbles(senderMessage, responseMessage, fee = "0.00") {
      // Create sender bubble HTML
      const senderBubbleHTML = `
        <div class="whatsapp-message-bubble_component is-sender" style="opacity: 0; display: flex; justify-content: flex-end;">
          <div class="whatsapp-message-bubble_wrapper sender" style="background-color: #D0FECF; text-align: left;">
            <div class="whatsapp-message-text">${senderMessage}</div>
            <div class="whatsapp-timestamp">15:45</div>
          </div>
        </div>
      `;
    
      // Create response bubble HTML
      const responseBubbleHTML = `
        <div class="whatsapp-message-bubble_component is-response" style="opacity: 0">
          <div class="whatsapp-message-bubble_wrapper">
            <div class="whatsapp-message-text">${responseMessage}</div>
            <div class="whatsapp-timestamp">15:46</div>
          </div>
        </div>
      `;
    
      // Create third bubble HTML with dynamic fee from API
      const thirdBubbleHTML = `
        <div class="whatsapp-message-bubble_component is-final" style="opacity: 0">
          <div class="whatsapp-message-bubble_wrapper">
            <div class="whatsapp-message-text">If it's your first time, your fee will be <span class="text-weight-bold">$${fee}</span>.</div>
            <div class="whatsapp-timestamp">15:46</div>
          </div>
        </div>
      `;
    
      // Remove any existing dynamic bubbles
      $('#interfaceChatBox .whatsapp-message-bubble_component.is-sender, #interfaceChatBox .whatsapp-message-bubble_component.is-response, #interfaceChatBox .whatsapp-message-bubble_component.is-final')
        .remove();
    
      // Add bubbles to the chat container
      $('#interfaceChatBox .whatsapp-message-bubble_component.is-1').after(senderBubbleHTML);
      $('#interfaceChatBox .whatsapp-message-bubble_component.is-sender').after(responseBubbleHTML);
      $('#interfaceChatBox .whatsapp-message-bubble_component.is-response').after(thirdBubbleHTML);
    
      // Animate bubbles in sequence with autoscroll
      setTimeout(function () {
        $('#interfaceChatBox .whatsapp-message-bubble_component.is-sender').animate({
          opacity: 1
        }, 300, function () {
          // Scroll to this specific message
          scrollToMessage('#interfaceChatBox .whatsapp-message-bubble_component.is-sender');
        });
      }, 100);
    
      setTimeout(function () {
        $('#interfaceChatBox .whatsapp-message-bubble_component.is-response').animate({
          opacity: 1
        }, 300, function () {
          // Scroll to this specific message
          scrollToMessage('#interfaceChatBox .whatsapp-message-bubble_component.is-response');
        });
      }, 800);
    
      setTimeout(function () {
        $('#interfaceChatBox .whatsapp-message-bubble_component.is-final').animate({
          opacity: 1
        }, 300, function () {
          // Scroll to this specific message
          scrollToMessage('#interfaceChatBox .whatsapp-message-bubble_component.is-final');
    
          // Hide fieldInputs and show ctaLink
          $('#fieldInputs').fadeOut(500, function () {
            $('#ctaLink').css('display', 'flex').fadeIn(250);
          });
        });
      }, 1500);
    }
    
    // Extra: Make absolutely sure the form can't submit
    $(document).on('submit', '#whatsapp-conversion', function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    
    // Clear tooltip when user starts to fix the issue
    amountInput.on('focus input', function () {
      if ($(this).closest('#whatsapp-conversion').length) {
        $('.validation-tooltip[data-form="whatsapp-conversion"]').fadeOut(200, function () {
          $(this).remove();
        });
      }
    });
    
    countrySelect.on('focus change', function () {
      if ($(this).closest('#whatsapp-conversion').length) {
        $('.validation-tooltip[data-form="whatsapp-conversion"]').fadeOut(200, function () {
          $(this).remove();
        });
      }
    });
  }