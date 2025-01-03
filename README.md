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

## Step 4, Run in development mode (hot reloads as you make changes)
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

## Step 4, Build for production
```
pnpm run build:prod
```

## Step 5, Remove $NVM_PATH if needed
If you do not have NVM managing your node installation, you will need to edit `package.json`. Find `$NVM_PATH` in the package.json and remove it.

If you are using NVM, then you will need to set the `NVM_PATH` environment variable to the path to `nvm-exec`. (Usually located at `/home/username/.nvm/nvm-exec`)

## Step 6, Run in production mode
```
pnpm run start:prod
```

# Note
Sometimes you may need to run `pnpm run clean` before `pnpm run dev`/`pnpm run start:prod` if you have an old build with some lingering deleted files (for example if deleting commands between builds).
