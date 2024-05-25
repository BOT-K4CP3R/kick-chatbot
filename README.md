<h1>Get token</h1>

To get the token, you need to send a message in the chat and intercept the query to the API in the "NETWORK" tab and then copy the "authorization" header from it.

<h1>Get cookies</h1>

To obtain cookies for the config, you need to log in to the bot account and paste this script into the console and then paste the return message into the config.

```function getFormattedCookies() {
  const cookieString = document.cookie;

  const cookies = cookieString.split('; ');

  const cookieObject = cookies.reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = value;
    return acc;
  }, {});

  const formattedCookies = Object.entries(cookieObject).map(([name, value]) => `${name}=${value}`).join('; ');

  return formattedCookies;
}

const formattedCookies = getFormattedCookies();
console.log(formattedCookies);
```

<footer>This is not an official form of creating bots on the kick.com platform!</footer>
