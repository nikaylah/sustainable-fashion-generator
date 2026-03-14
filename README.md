# AI Sustainable Fashion Generator

An experimental creative prototype that generates sustainable outfit concepts based on natural fibers, climate needs and personal values.

Built as part of my portfolio exploring how generative AI tools can encourage more thoughtful, sustainability-driven design decisions.

## What it does

Users select design priorities, climate, fiber preference, style vibe, color palette and values like breathability or modest layering and the generator produces:

- A named outfit concept with description
- Fabric recommendations with sustainability context
- A color palette shown as visual swatches
- Styling notes
- An AI reasoning section explaining why these choices match the user's values

## Why I built this

Most fashion inspiration tools prioritize trends. I wanted to explore what a tool might look like if sustainability and natural fibers came first and how AI could help people make more intentional design decisions.

## Tech stack

- React + Vite
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-20250514)
- Vercel serverless functions (for secure API key handling)
- Deployed on Vercel

## Running locally

- Clone the repo
- Run npm install
- Copy .env.example to .env and add your Anthropic API key
- Run npm run dev
- Open http://localhost:5173

## Part of a larger exploration

This prototype is one piece of a broader portfolio exploring how design and technology can support more meaningful, human centered digital experiences.
