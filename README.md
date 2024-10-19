# Prerequisites
- Node.js (Any version v18 through v23 confirmed to work with this project)

- `npm` or `npm` equivalent

I personally recommend `pnpm` instead of `npm`. `pnpm` is what I use, so if you use `npm` or a different `npm` equivalent, you will need to use the equivalent commands.

- This repo cloned locally with git (or downloaded as a zip and extracted) and then `cd`ed into ready to use commands at the root of this project.
# Develop

## Step 1, Install all NPM dependencies if needed
```
pnpm i
```

## Step 2, Migrate database if needed
If no database present, database needs migrations, or not sure, then run:
```
pnpm run migrate:dev
```

## Step 3, Create development .env file if needed
Copy `.env.development.example` as `.env.development` and replace "bot-token-goes-here" with the actual development bot token.

## Step 4, Update package.json to point to development dist folder
Set "main" property in package.json to `dist/dev/index.js`

## Step 5, Run in development mode (hot reloads as you make changes)
```
pnpm run dev
```


# Deploy Production

## Step 1, Install all NPM dependencies if needed
```
pnpm i
```

## Step 2, Migrate database if needed
If no database present, database needs migrations, or not sure, then run:
```
pnpm run migrate:prod
```

## Step 3, Create production .env file if needed
Copy `.env.production.example` as `.env.production` and replace "bot-token-goes-here" with the actual production bot token.

## Step 4, Update package.json to point to production dist folder
Set "main" property in package.json to `dist/prod/index.js`

## Step 5, Build for production
```
pnpm run build:prod
```

## Step 6, Run in production mode
```
pnpm run start:prod
```