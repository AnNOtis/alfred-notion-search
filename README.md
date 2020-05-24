# Alfred Notion Search

> Alfred workflow for searching Notion.

<img src="https://raw.githubusercontent.com/AnNOtis/alfred-notion-search/master/screenshot.png" width="500">


## Install

```
$ npm install --global alfred-notion-search
```

Open Notion in your browser and open the developer tools and go to the network tab

Do a quick search using ctrl/cmd+p for anything

Find the network request called search and in the headers tab scroll the to bottom to find the req payload

<img src="https://raw.githubusercontent.com/samlazrak/alfred-notion-search/master/notion%20payload.png" width="500">

Grab the `space_id` value and then go to the cookies tab

<img src="https://raw.githubusercontent.com/samlazrak/alfred-notion-search/master/notion%20cookie%20headers.png" width="500">

Grab the values from `token_v2`

Change `space_id` & `token_v2` in Alfred workflow environment variables.

Requires Node.js 8+, Alfred 3 and the Alfred Powerpack.

## Usage

In Alfred, type `ns <keyword>` to search.

Select one of result and press enter to navigate to the Notion page for the result.
