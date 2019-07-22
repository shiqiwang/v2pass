import {createServer} from 'http';

let server = createServer((req, res) => {
  res.end('hello');
});

server.listen(1337);
