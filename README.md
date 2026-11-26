# meteor-bug

Minimal Meteor application reproducing a reported bug.

The repository is deliberately small: just enough client, import and server code to trigger the issue while keeping `package-lock.json` fixed at the versions where it appears.

## Usage

```bash
npm install
npm start
```

Open http://localhost:3000 to see the reproduction. `npm run visualize` analyses the production bundle.

## License

MIT
