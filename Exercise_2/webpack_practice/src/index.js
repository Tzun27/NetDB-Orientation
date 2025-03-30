import "./styles.css";
alert("Hello! I am an alert box!");

// Function to create the restaurant homepage
function createHomepage() {
  // Get the content div
  const content = document.getElementById("content");

  // Create hero image
  const heroImage = document.createElement("img");
  heroImage.src =
    "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/f5/5e/e2/corner-steak-house-s.jpg?w=600&h=400&s=1";
  heroImage.alt = "Elegant dining area with warm lighting and modern decor";
  heroImage.className = "hero-image";

  // Create headline
  const headline = document.createElement("h1");
  headline.textContent = "Welcome to Savory Haven";

  // Create tagline
  const tagline = document.createElement("p");
  tagline.className = "tagline";
  tagline.textContent = "Where culinary artistry meets warm hospitality";

  // Create description section
  const description = document.createElement("div");
  description.className = "description";

  const paragraph1 = document.createElement("p");
  paragraph1.textContent =
    "Nestled in the heart of downtown, Savory Haven offers a unique dining experience that combines innovative cuisine with a welcoming atmosphere. Our chefs craft each dish with locally-sourced ingredients, bringing vibrant flavors and artistic presentation to your table.";

  const paragraph2 = document.createElement("p");
  paragraph2.textContent =
    "Whether you're joining us for an intimate dinner, celebrating a special occasion, or simply enjoying our craft cocktails at the bar, we promise an unforgettable experience that will delight all your senses.";

  // Append paragraphs to description
  description.appendChild(paragraph1);
  description.appendChild(paragraph2);

  // Create highlights section
  const highlights = document.createElement("div");
  highlights.className = "highlights";

  // Create highlight items
  const highlightItems = [
    {
      title: "Seasonal Menu",
      text: "Our menu changes with the seasons to bring you the freshest ingredients at their peak.",
    },
    {
      title: "Award-Winning Chef",
      text: "Experience the culinary magic created by our renowned executive chef.",
    },
    {
      title: "Cozy Atmosphere",
      text: "Enjoy our thoughtfully designed space that balances elegance with comfort.",
    },
  ];

  // Create and append each highlight item
  highlightItems.forEach((item) => {
    const highlightItem = document.createElement("div");
    highlightItem.className = "highlight-item";

    const itemTitle = document.createElement("h3");
    itemTitle.textContent = item.title;

    const itemText = document.createElement("p");
    itemText.textContent = item.text;

    highlightItem.appendChild(itemTitle);
    highlightItem.appendChild(itemText);
    highlights.appendChild(highlightItem);
  });

  // Create CTA section
  const cta = document.createElement("div");
  cta.className = "cta";

  const reservationBtn = document.createElement("button");
  reservationBtn.className = "reservation-btn";
  reservationBtn.textContent = "Reserve Your Table";

  cta.appendChild(reservationBtn);

  // Append all elements to content div
  content.appendChild(heroImage);
  content.appendChild(headline);
  content.appendChild(tagline);
  content.appendChild(description);
  content.appendChild(highlights);
  content.appendChild(cta);
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", createHomepage);
