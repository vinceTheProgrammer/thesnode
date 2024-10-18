# Develop
Set "main" property in package.json to `dist/dev/index.js`, then
```
pnpm run dev
```


# Deploy
Set "main" property in package.json to `dist/prod/index.js`, then
```
pnpm run build:prod && pnpm run start:prod
```