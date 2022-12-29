const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/aged-pointed-goose|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/chain-ruddy-plane|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/universal-catnip-tray|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/elastic-blushing-olive|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/lavender-muddy-voice|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/verbena-mellow-saver|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/fast-morning-entree|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/modern-chill-squirrel|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/giant-incongruous-hemisphere|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/pretty-brick-emu|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/tar-discovered-lancer|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/ludicrous-shining-soprano|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/bright-substantial-gorilla|https://dc3667e4-8106-4f25-98a8-948a1e0c0bca@api.glitch.com/git/insidious-solid-attention`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();