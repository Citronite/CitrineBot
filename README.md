> **NOTE:** I've decided to put this project to rest, after getting busy with other stuff and
> not having the time to continue this project (which I imagine would need major changes as well
> after the updates to Discord's API since I last worked with it).

<h4 align="center">
    <a href="https://github.com/Citronite/CitrineBot">
        <img src="https://i.imgur.com/D0I9Yoq.png?size=1024" alt="CitrineBanner"/>
    </a>
</h4>

<h1 align="center">
    CitrineBot - A powerful & extensible Discord bot!
</h1>

<p align="center">
    <a href="https://github.com/prettier/prettier">
        <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat">
    </a>
    <a href="https://github.com/Quantomistro3178/CitrineBot/pulls">
        <img alt="pull requests: open" src="https://img.shields.io/badge/PRs-open-42ff93.svg?style=flat">
    </a>
    <a href ="https://github.com/Quantomistro3178/CitrineBot">
        <img alt="version: 0.1.0" src="https://img.shields.io/badge/version-0.1.0-66ff99.svg?style=for-the-badge">
    </a>
    <a href="https://github.com/discordjs/discord.js">
        <img alt="discord.js" src="https://img.shields.io/badge/discord-.js-42c6ff.svg?style=flat">
    </a>
    <a href="https://discord.gg/yyqjd3B">
        <img alt="chat on: discord" src="https://img.shields.io/badge/chat_on-discord-7289da.svg?style=flat">
    </a>
</p>

<hr/>

# Overview
Citrine is a powerful, and highly extensible Discord bot.

*(I'll add more later. If you wanna help with this or other docs stuff, feel free)*
<br/>

# Installation
The docs and installation guides aren't ready yet, but here's a quick guide on installation and setup.
You should have [Node.js](https://nodejs.org/en/) (version 10 or above) installed, and preferably [git](https://git-scm.com/).

If you want to spend minimal time on set-up, clone/download the **stable** branch, which contains only the transpiled code.
By default, Citrine will store data in memory (meaning all your settings will be lost after the bot shuts down), but it has support for SQLite-based persistence (more will be added later on) with the help of [Keyv](https://github.com/lukechilds/keyv).

For SQLite, you'll have to install additional packages:
```npm install keyv @keyv/sqlite```

Then, open `./bin/citrine.js` and edit the options for the CitrineClient:
```js
const options = {
    // Edit the DbProvider option and set it to 'SQLiteKV'
    DbProvider: 'SQLiteKV'
}
```

And that's about it. Run the launcher file and it will ask for your bot token and the prefix (which can be changed later, of course).
The launcher will then create the necessary files needed to run Citrine. Once it's finished, you should have a `start_citrine` file in the folder. You can start citrine using that file, or using the launcher, or entering `npm run citrine` in the console, or entering `node ./bin/citrine.js` in the console.

If you have any troubles, feel free to join the [support server](https://discord.gg/yyqjd3B) for help.

<br/>

# Contribute
Citrine is still in development stages. Testing, built-in Chips, documentation, installation & usage guides, and much more still needs work. If you feel like contributing, feel free to open a PR, or drop by at the [support server!](https://discord.gg/yyqjd3B).

<br/>

# License

<a href="https://github.com/Citronite/CitrineBot/blob/master/LICENSE">
    <img alt="license: GPL-3.0" src="https://img.shields.io/badge/LICENSE-GPL--3.0-orange.svg?style=for-the-badge">
</a>
