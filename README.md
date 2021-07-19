# firestore-sample

Cloud Firestore sample code

## how to run

Get firebaseConfig from Project settings.

```bash
$ export FIREBASE_CONFIG='{"apiKey": ...}'
$ export FIREBASE_COL_ID="mydata"
$ export FIREBASE_DOC_ID="doc1"
$ export FIREBASE_DEBUG="debug"
$ export PORT="18080"
```

Run a server to send a message, and to receive messages.

```bash
$ yarn dev
...
snapshot 0 SnapshotMetadata { hasPendingWrites: false, fromCache: false }
read message size:  0
```

Go to http://localhost:18080/message via web browser.

There is no messages.

Send a message via http request.

```
$ curl localhost:18080/send
sent message at Mon Jul 19 2021 12:35:58 GMT+0900 (日本標準時)
```

After requestig, confirm the messages on http://localhost:18080/message .
