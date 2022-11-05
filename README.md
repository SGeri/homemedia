<p align="center">
    <br/>
    <a href="https://github.com/SGeri/homemedia" target="_blank"><img width="800px" src="https://i.imgur.com/3b962uD.png" /></a>
    <h2 align="center">HomeMedia</h2>
    <p align="center">
        A complete solution for your home media needs.
    </p>
    <p align="center" style="align: center;">
        <a href="https://github.com/SGeri/homemedia">
            <img alt="stars" src="https://img.shields.io/github/stars/SGeri/homemedia?style=for-the-badge">
        </a>
        <a href="https://github.com/SGeri/homemedia">
            <img src="https://img.shields.io/badge/version-1.0.0-<COLOR>?style=for-the-badge" alt="Bundle Size"/>
        </a>
        <a href="https://github.com/SGeri/homemedia">
            <img src="https://img.shields.io/badge/node-16+-blue?style=for-the-badge" alt="Downloads" />
        </a>
        <a href="https://github.com/SGeri/homemedia">
            <img src="https://img.shields.io/github/license/SGeri/homemedia?style=for-the-badge" alt="ISC" />
        </a>
   </p>
</p>

## Overview

This project utilizes a few packages and services in order to create the best home media experience. Even for everyday users it allows to use a very simple slash command based system on Discord to download movies and shows, categorized them using a special media management system called Jellyfin.

### Used technologies

The Media Server is made using [Jellyfin](https://jellyfin.org) with [Docker](https://www.docker.com) and for easy container management [Portainer](https://www.portainer.io). There is also a Discord client for easy communcation with the torrent provider.

## Installation

### 0. Prerequisites

- Server machine for deploying Jellyfin and hosting the Discord application (Linux is advised)

### 1. Installation of Portainer

Portainer is a great service for running multiple docker containers and organizing them into stacks.
A short guide of installation can be found [here](https://docs.portainer.io/start/install/server/docker/linux).

### 2. Installation of Jellyfin using docker-compose.yml

Jellyfin is the core of this project and it serves as a Media Management System for the users.
The docker-compose.yml file for my Jellyfin setup is located in the [docs/docker-compose.yml](https://github.com/SGeri/homemedia/blob/main/docs/docker-compose.yml).

### 3. Setup the Discord application

Create a Discord Application on the [Discord Developer Portal](https://discord.com/developers/applications) then add Bot features and copy the authentication token. It will be needed later so save it! Also don't forget to store the application's app id! ;)

### 4. Create local Discord application

```
git clone https://github.com/SGeri/homemedia.git
cd homemedia
npm install
```

#### 5. Configure environment variables

In the root directory copy the .env.example file:

```
cp .env.example .env
```

Fill out the new newly created environmental file with your nCore credentials ([here](https://www.npmjs.com/package/ncore-scraper) is a guide for generating nCore "unsafe mode" password, just scroll down to the "_Get hashed nCore password_" section), Discord application token, ID and a channel ID which is used for displaying global errors. Also you can specify the path of the downloaded media using the _MEDIA_LOCATION_ variable. There is an opitonal variable _SCRAPER_DEBUG_ if you want to enable advanced logging for scraping nCore torrents.

### 6. Deploying the application

I advise you to use PM2 for deploying NodeJS applications because of how reliable and easy-to-use it is. [Here](https://pm2.keymetrics.io/docs/usage/quick-start/) is a short guide for installing it, and a [StackOverFlow answer](https://stackoverflow.com/a/37775318) for quickly setting up a the project.

### 7. Have fun!

## Final words

If you have any questions or ideas let me know! You can reach me out on Discord (SGeri#0731) or by creating an issue here on Github. I'm not planning on actively continuing and of my side projects but I'll answer as soon as I can!
