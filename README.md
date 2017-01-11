# HTML parser client
Utility class that will give some metadata information regarding the html extracted from the endpoint passed as an argument.

## JSON structure
```
{
  "tags": {
    <tag> : {
      "childsMeta": {
        <tag>: <count>
      },
      "attribsMeta": {
        <tag>: <count>
      },
      "count": <count>
    }
  },
  "links": {
    <tag>: <domain[]>
  },
  max-depth: <depth>
}
```

## Run
##### First you need to install all dependencies
```sh
npm i
```
##### Second you need to npm link so you can actually have use it as a shell command
```sh
npm link
```
##### Finally you can now execute anywhere you'd like
```sh
parse-html <endpoint>
```

## Unit tests
### Single run
```sh
npm test
```
### Watch mode
```sh
npm test-watch
```

## Linting
```sh
npm run lint
```
