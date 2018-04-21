require("isomorphic-fetch");

const slackAddress = process.env.SLACK_NOTIFY_WEBHOOK;

const notifySlack = async message => {
    const result = await fetch(slackAddress, {
        method: "POST",
        body: JSON.stringify({
            text: message
        }),
        headers: {
            "content-type": "application/json"
        }
    });
    if (result.status !== 200) {
        const text = await result.text();
        throw new Error(`Failed with ${result.status}: ${text}`);
    }
};

const createMessage = async type => {
    const {
        CIRCLE_COMMIT: commit,
        CIRCLE_BUILD_NUM: buildNum,
        CIRCLE_BUILD_URL: buildUrl
    } = process.env;
    switch (type) {
        case "staging": {
            const stagingUrl = process.env.NOW_DEPLOY;
            notifySlack(
                `#${buildNum}: Deployed demo to staging URL ${stagingUrl} from ${commit}`
            );
            break;
        }
        case "build": {
            const {
                CIRCLE_PULL_REQUEST: pr,
                JARL_VERSION: version
            } = process.env;
            if (pr) {
                notifySlack(`#${buildNum}: Pull request ${pr} - ${buildUrl}`);
            } else {
                notifySlack(
                    `#${buildNum}: Building version ${version} - ${buildUrl}`
                );
            }
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
