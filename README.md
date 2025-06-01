# 🍜 NeonFood - Restaurant Food Ordering App

A modern, responsive restaurant food ordering web application built with React, Vite, and Tailwind CSS.

## Features

- 🍕 **Interactive Menu** - Browse through different food categories (Pizza, Burgers, Sides, Drinks)
- 🛒 **Shopping Cart** - Add, remove, and update quantities of items
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful design with smooth animations and transitions
- ⭐ **Rating System** - View ratings for each menu item
- 🔥 **Popular Items** - Highlighted popular dishes
- 💳 **Checkout Process** - Simple checkout flow (demo only)

## Tech Stack

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **JavaScript** - Programming language

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd neonfood
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx      # Navigation and cart button
│   ├── Hero.jsx        # Hero section with CTA
│   ├── Menu.jsx        # Food menu with categories
│   ├── Cart.jsx        # Shopping cart sidebar
│   └── Footer.jsx      # Footer with contact info
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Breakdown

### Menu System
- Dynamic category switching
- Item ratings and descriptions
- "Popular" item badges
- Add to cart functionality

### Shopping Cart
- Sliding cart panel
- Quantity management
- Item removal
- Total price calculation
- Checkout simulation

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Demo

This is a demonstration project showcasing a modern restaurant food ordering interface. The checkout process is simulated and doesn't process real payments.
