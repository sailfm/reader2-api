# Reader v1

A simple node/hapi readability proxy.

https://aws.sail.fm/chapter-4/introduction.html

## Setup

```sh
git clone https://github.com/sailfm/reader1
cd reader1
npm install
# run in development
npm start
# run in production (with pm2 installed globally)
pm2 run production
```

## Production Setup

```sh
npm install -g pm2
pm2 startup
<Run the suggested command printed by 'pm2 startup'>
```

* pm2 status - view state of running processes
* pm2 save - saves running processes so pm2 can restore them
* pm2 delete <ID> - kills the process with the given ID (run pm2 status to discover ID)
* pm2 resurrect - restore saved processes


