import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import http from "http";

firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG!));
firebase.firestore.setLogLevel(
  (process.env.FIREBASE_DEBUG ?? "silent") as firestore.LogLevel
);

const colId = process.env.FIREBASE_COL_ID!;
const docId = process.env.FIREBASE_DOC_ID;
const port = parseInt(process.env.PORT ?? "18080");

let messages: any[] = [];

async function readMessages() {
  try {
    firebase
      .firestore()
      .collection(colId)
      .doc(docId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        console.log("snapshot", snapshot.size, snapshot.metadata);
        const _messages: any[] = [];
        snapshot.forEach((result) => {
          const raw = result.data();
          _messages.push({
            text: raw.text,
            createdAt: raw.createdAt
              ? new Date(raw.createdAt.seconds * 1000)
              : new Date(),
          });
        });
        console.log("read message size: ", _messages.length);
        messages = _messages;
      });
  } catch (e) {
    console.log("ERROR read messages:", e);
  }
}

async function sendMessage(seq: number) {
  try {
    await firebase
      .firestore()
      .collection("mydata")
      .doc(docId)
      .collection("messages")
      .add({
        text: `message ${seq}`,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  } catch (e) {
    console.log("ERROR send message:", e);
  }
  console.log("a message sent");
}

async function main() {
  readMessages();

  console.log(`port: ${port}`);
  let sequence = 0;
  const server = http.createServer(async (req, res) => {
    res.writeHead(200);
    if (req.url === "/message") {
      const body = messages.map((msg) => JSON.stringify(msg)).join("<br />");
      const html = `<html><body>messages:<br />${body}</body></html>`;
      res.end(html);
    } else if (req.url === "/send") {
      await sendMessage(sequence);
      sequence += 1;
      res.end(`sent message at ${new Date()}\n`);
    } else {
      res.end();
    }
  });
  server.listen({ host: "localhost", port });
}

if (require.main === module) {
  (async () => {
    await main();
  })();
}
