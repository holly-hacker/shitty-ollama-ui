# Shitty Ollama UI

This repo holds a simple Ollama UI for locally hosted instances of Ollama, with
basic history editing.

## Motivation

I couldn't find an Ollama UI that wasn't super bloated or annoying to install.
The goal with this UI was to make something that:
1. Is simple to install (just host the html, js and css files with any web
server)
2. Is lightweight
3. Has at least basic (and working) history editing

This project does exactly this. It allows you to delete, re-generate and fully
edit past messages (both user and assistant), so you can gaslight your favorite
LLM as much as you want.

## Running

0. Have an instance of ollama running on localhost on the default port
1. Either grab a copy from the releases, or build it locally with `npm run
build`
2. Host the server using a HTTP server of your choosing (such as
`simple-http-server`)

Alternatively, just run `npm run dev`.
