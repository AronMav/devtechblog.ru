# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Quartz v4 site - a static site generator for publishing digital gardens and notes as websites. Quartz transforms Markdown files into a fully-featured website with features like backlinks, graph view, search, and more.

**Site Details:**
- Site Title: DevTechBlog
- Locale: Russian (ru-RU)  
- Base URL: devtechblog.ru
- Content located in `content/` directory

## Development Commands

### Build and Serve
```bash
# Build and serve locally with hot reloading
npx quartz build --serve

# Build for production 
npx quartz build

# Serve documentation
npm run docs
```

### Code Quality
```bash
# Type check and format check
npm run check

# Format code
npm run format

# Run tests
npm run test
```

### Build Options
- `-d` or `--directory`: content folder (default: `content`)
- `-v` or `--verbose`: extra logging
- `-o` or `--output`: output folder (default: `public`)
- `--serve`: run local hot-reloading server
- `--port`: local server port
- `--concurrency`: parsing threads

## Architecture

### Core Structure
```
quartz/
├── build.ts           # Main build orchestration
├── cfg.ts             # Configuration types
├── components/        # React/Preact UI components
├── plugins/           # Content transformation pipeline
│   ├── transformers/  # Process content (frontmatter, syntax highlighting)
│   ├── filters/       # Filter content (drafts)
│   └── emitters/      # Generate output (pages, assets)
├── processors/        # Parse, filter, emit pipeline
├── util/              # Utility functions
└── styles/            # SCSS stylesheets
```

### Plugin System
Quartz uses a three-stage plugin pipeline:
1. **Transformers**: Process markdown content (frontmatter, syntax highlighting, LaTeX)
2. **Filters**: Filter content (remove drafts, explicit publish)
3. **Emitters**: Generate output files (content pages, folder pages, assets)

### Component System  
- Built with Preact (React-compatible)
- Components in `quartz/components/`
- Layout defined in `quartz.layout.ts`
- Responsive design with `DesktopOnly`/`MobileOnly` components

### Configuration Files
- `quartz.config.ts`: Site configuration, plugins, theme
- `quartz.layout.ts`: Page layout components
- `tsconfig.json`: TypeScript configuration

### Content Processing
1. Markdown files parsed from `content/` directory
2. Transformed by plugins (frontmatter, links, syntax highlighting)
3. Filtered (drafts removed)
4. Emitted as static HTML files

### Styling
- SCSS files in `quartz/styles/`
- Custom properties for theming
- Uses JetBrains Mono for headers/body, Fira Code for code
- Dark/light mode support

## Key Technologies
- **TypeScript**: Strict type checking enabled
- **Preact**: React-compatible UI framework  
- **esbuild**: Fast bundling and compilation
- **rehype/remark**: Markdown processing
- **D3.js**: Graph visualizations
- **Flexsearch**: Full-text search
- **Sharp**: Image processing
- **SCSS**: Styling

## Development Notes
- Node.js ≥22 and npm ≥10.9.2 required
- ESM modules throughout (type: "module")
- Hot reloading available in serve mode
- Content changes trigger incremental rebuilds