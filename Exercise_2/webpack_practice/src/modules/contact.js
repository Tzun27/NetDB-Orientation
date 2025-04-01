export default function createContact() {
    const content = document.getElementById('content');
    
    const contactContainer = document.createElement('div');
    contactContainer.className = 'contact-container';
    
    contactContainer.innerHTML = `
      <h2>Contact Us</h2>
      <div class="contact-info">
        <p>📞 (555) 123-4567</p>
        <p>📍 123 Gourmet Street, Food City</p>
        <p>✉️ info@restaurant.com</p>
      </div>
      <div class="hours">
        <h3>Opening Hours</h3>
        <p>Monday - Friday: 11am - 10pm</p>
        <p>Weekends: 10am - 11pm</p>
      </div>
    `;
  
    content.appendChild(contactContainer);
  }
  