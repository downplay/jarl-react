const Discord = require("discord.js");
const path = require("path");

const client = new Discord.WebhookClient(
    process.env.DISCORD_WEBHOOK_ID,
    process.env.DISCORD_WEBHOOK_TOKEN
);

const notifyDiscord = (message, file) => client.send(message, file);

const findCypressScreenshot = () =>
    path.resolve(__dirname, "../demo/cypress/screenshots/HomePage.png");

const createMessage = async type => {
    const {
        CIRCLE_COMMIT: commit,
        CIRCLE_BUILD_NUM: buildNum,
        CIRCLE_BUILD_URL: buildUrl,
        CIRCLE_PULL_REQUEST: pr,
        JARL_VERSION: version
    } = process.env;
    const prefix = `[#${buildNum}](${buildUrl}):`;
    switch (type) {
        case "staging": {
            const filePath = findCypressScreenshot();
            const stagingUrl = process.env.NOW_DEPLOY;
            notifyDiscord(
                `${prefix} Deployed demo to staging URL ${stagingUrl} from ${commit}`,
                filePath
            );
            break;
        }
        case "build": {
            if (pr) {
                notifyDiscord(`${prefix} Pull request ${pr}`);
            } else if (version) {
                notifyDiscord(`${prefix} Building version ${version}`);
            } else {
                notifyDiscord(`${prefix} Staging demos`);
            }
            break;
        }
        case "published":
            notifyDiscord(
                `${prefix} Published ${version} to npm registry: <https://www.npmjs.com/package/jarl-react>`
            );
            break;
        case "deployed": {
            const filePath = findCypressScreenshot();
            notifyDiscord(
                `${prefix} Deployed ${version} to http://jarl.downplay.co`,
                filePath
            );
            break;
        }
        default:
            throw new Error("Unknown notification type");
    }
};

const [, , type] = process.argv;

/* eslint-disable no-console */
createMessage(type)
    .then(() => {
        console.log("Sent");
    })
    .catch(e => {
        console.error(e);
    });
