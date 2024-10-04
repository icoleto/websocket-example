const { createServer } = require("http");
const { Server } = require("ws");
const { readFile } = require("fs");
const { join } = require("path");

const server = createServer((req, res) => {
  const filePath = req.url === "/" ? join(__dirname, "index.html") : null;
  readFile(filePath || "", (err, data) => {
    if (err)
      res
        .writeHead(filePath ? 500 : 404)
        .end(filePath ? "Error" : "Recurso no encontrado");
    else res.writeHead(200, { "Content-Type": "text/html" }).end(data);
  });
});

const wss = new Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const { user, text } = JSON.parse(message);
    wss.clients.forEach(
      (client) =>
        client.readyState === ws.OPEN &&
        client.send(JSON.stringify({ user, text }))
    );
  });
  ws.send(JSON.stringify({ user: "Sistema", text: "¡Bienvenido al chat!" }));
});

server.listen(process.env.PORT || 8080, () =>
  console.log("Servidor en http://localhost:8080")
);
