export default function createMenu() {
    const content = document.getElementById('content');
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
  
    const menuItems = [
      { name: 'Steak Diane', price: '$42', desc: 'Prime beef with brandy-peppercorn sauce' },
      { name: 'Seafood Paella', price: '$38', desc: 'Spanish saffron rice with fresh catch' },
      { name: 'Vegetarian Risotto', price: '$32', desc: 'Creamy Arborio rice with seasonal vegetables' }
    ];
  
    menuItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';
      
      itemDiv.innerHTML = `
        <h3>${item.name} <span>${item.price}</span></h3>
        <p>${item.desc}</p>
      `;
      
      menuContainer.appendChild(itemDiv);
    });
  
    content.appendChild(menuContainer);
  }
  