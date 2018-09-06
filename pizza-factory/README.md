<p align="center"><img src="http://www.antonius-ostermann.de/assets/images/assistantjs.png"></p>

# AssistantJS Examples Pizza-Factory
This repository initializes an example "pizza factory" assistantJS application. It is configured to use plenty of available assistantJS modules and runs on alexa, dialogflow and google assistant. By cloning this repository, it should be easy for you to start building your own assistantJS application. Happy coding!

## 

## Integrated optional assistantJS components
1. assistant-alexa
2. assistant-apiai
3. assistant-google
4. assistant-validations
5. assistant-authentication
6. assistant-generic-utterances

## Prerequisites
1. Proper global installation of assistantJS
2. Installed and running redis
3. Recommended: Installed https://ngrok.com/ - this makes it easy to test your app on an amazon echo or google home without deploying

## Getting started on an assistant
1. Clone this repository
2. Open `config/components.ts` and edit redis connection settings, if needed
3. Run `tsc` to compile to javascript
4. Generate all platform configurations: `assistant generate` (or just `assistant g`)
5. Start the assistantJS express server: `assistant server`
6. If you installed ngrok: Generate a public available URL for your server: `ngrok http 3000`

### Run on amazon alexa
7. Paste your applicationID (viewable in amazon developers console) in `config/components.ts`
8. Re-run steps (3), (5) and (6)
9. Paste the generated intents and utterances into skill configuration
10. Paste your ngrok https url (step (6)) into the skill configuration, but don't forget to add the configured route (see `config/components.ts`), which defaults to "/alexa"

### Run on google assistant / dialogflow
11. Import the generated zip archive into dialogflow
12. Copy authentication headers from `config/components.ts` and paste them into fulfillment configuration
13. Paste your ngrok https url (step (6)) into the fulfillment configuration, but don't forget to add the configured route (see `config/components.ts`), which defaults to "/apiai"

## Debug
Remember: assistantJS uses the awesome [bunyan module](https://www.npmjs.com/package/bunyan) to print log information if needed. You might want a global installation of bunyan to get the CLI in your PATH and be able to run `assistant s | bunyan` for pretty-printing logs