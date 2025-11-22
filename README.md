# 🎮 Pokémon Browser

A modern, responsive Pokémon browser built with React, TypeScript, and Tailwind CSS. Browse through all Pokémon with two different viewing modes: pagination controls or infinite scroll with load more functionality.

## 🌐 Live Demo

**[View Live Demo on Vercel](https://pockimon-b8er.vercel.app/)**


## ✨ Features

- **Two List View Modes**:
  - **Pagination View**: Navigate through Pokémon using page controls with prev/next buttons and page numbers
  - **Load More View**: Infinite scroll experience with "Load More" button to append additional Pokémon

- **Detailed Pokémon Pages**: Click any Pokémon to view:
  - Official artwork sprite
  - Height and weight
  - Type badges with color coding
  - Base stats with visual progress bars
  - Abilities
  - Base experience

- **Responsive Design**: Fully responsive layouts that adapt from mobile to desktop
  - Mobile: 1 column grid
  - Tablet: 2 column grid
  - Desktop: 4 column grid

- **Modern UX**:
  - Smooth transitions and hover effects
  - Loading skeletons during data fetch
  - Error handling with retry functionality
  - React Query for intelligent caching and data management

## 🚀 Tech Stack

- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **React Query** - Server state management and caching
- **Tailwind CSS v3** - Utility-first styling
- **PokéAPI** - Pokémon data source

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd pockimon

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
pockimon/
├── src/
│   ├── api/              # API service layer
│   │   └── pokemon.ts    # PokéAPI integration
│   ├── components/       # Reusable components
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonGrid.tsx
│   │   ├── Pagination.tsx
│   │   ├── LoadMoreButton.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── SkeletonCard.tsx
│   ├── pages/            # Route pages
│   │   ├── PaginationView.tsx
│   │   ├── LoadMoreView.tsx
│   │   └── DetailPage.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── usePokemonList.ts
│   │   └── usePokemonDetail.ts
│   ├── types/            # TypeScript type definitions
│   │   └── pokemon.ts
│   ├── App.tsx           # Main app with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```



## 📝 API Usage

This application uses the free [PokéAPI](https://pokeapi.co/) with the following endpoints:

- `GET /api/v2/pokemon?limit={limit}&offset={offset}` - List Pokémon
- `GET /api/v2/pokemon/{id}` - Get Pokémon details

React Query handles caching with a 5-minute stale time for list queries and 10-minute stale time for detail queries.




