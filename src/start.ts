import * as http from "http";

const port = Number(process.env.PORT);
const hostname = "0.0.0.0";

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
	res.end("Hello World");
});

server.listen(port, hostname, () => console.info("Main app has started..."));
