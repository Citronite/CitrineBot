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

> **NOTE:** Citrine is still in development stages. *Breaking changes can and will be made without notice*. There is still a lot to do, and it will be some time before Citrine is stable enough for proper usage. All help is appreciated, so feel free to [contribute.](#Contribute)

# Overview
Citrine is a fully functional, and highly extensible Discord bot.
(I'll add more later. If you wanna help with this or other docs stuff, feel free)
<br/>

# Installation
The docs and installation guides aren't ready yet, but here's a quick guide on installation and setup.
You should have Node.js (version 10 or above) installed, and preferably git.

## Stable
If you want to spend minimal time on configuration and set-up, clone/download the stable branch, which contains only the transpiled code.
By default, Citrine will store data in memory (meaning all your settings will be lost after the bot shuts down), but it has support for SQLite-based persistence (more will be added later on).

For SQLite, you'll have to install additional packages:
```npm install keyv @keyv/sqlite```

Then open `./bin/citrine.js` and edit the options for citrine:
```js
const options = {
    // Edit the dbDriver option and set it to 'SQLiteKV'
    dbDriver: 'SQLiteKV'
}
```

And that's about it. Run `launcher.bat` or `launcher.sh` and it will ask for your bot token and the prefix (which can be changed later, of course).
The launcher will create the necessary files needed to run Citrine. Once it's finished, you should have a `start_citrine` file in the folder. You can start citrine using that file, or using the launcher, or using `npm run citrine` in the console, or `node ./bin/citrine.js` in the console.

## Master
The master branch contains only the TypeScript source code for citrine. The set-up is pretty much the same as above, except when running the launcher, it will try to build the source code and you will likely get an error along the lines of `cannot import module "keyv"`. Just restart the launcher and you shouldn't get that error again. Even if you do, its safe to ignore, since installing `keyv` is optional.

If you have any troubles, feel free to open an issue or join the support server.

<br/>

# Contribute
Citrine is still in development stages. Testing, built-in Chips, documentation, installation & usage guides, and much more still needs work. If you feel like contributing, feel free to open a PR, or drop by at the [support server!](https://discord.gg/yyqjd3B).

<br/>

# License

<a href="https://github.com/Citronite/CitrineBot/blob/master/LICENSE">
    <img alt="license: GPL-3.0" src="https://img.shields.io/badge/LICENSE-GPL--3.0-orange.svg?style=for-the-badge">
</a>
