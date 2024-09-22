import { Hono } from 'hono'
import {logger}  from "hono/logger"
import { HTTPException } from 'hono/http-exception'

import * as crypto from 'crypto';
import assert from 'assert';


const app = new Hono()
app.use(logger())

/*
Keys generated with 
#!/bin/bash
openssl genpkey -algorithm RSA -out private-key.pem
openssl rsa -pubout -in private-key.pem -out public-key.pem
*/
const publicKeyFile = Bun.file("./public-key.pem")
const privateKeyFile =  Bun.file("./private-key.pem")
let publicKey: string|null = null;
let privateKey: string|null = null;

async function loadKeys(){
 publicKey = await publicKeyFile.text()
 privateKey = await privateKeyFile.text()
}
loadKeys();

function generateDigitalSignature(data: string): string {
  if(!privateKey) throw new HTTPException(425);

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  return sign.sign(privateKey, 'base64');
}

function validateDigitalSignature(data: string, receivedSignature: string,externalPublicKey: string): boolean {
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(data);
  return verify.verify(externalPublicKey, receivedSignature, 'base64');
}

app.get('/', (c) => {
  return c.text('It works!')
})

app.get('/capabilities', (c) => {
  return c.text('PRIVATE_TEXT_MESSAGES')
})

app.get('/public-key.pem', async (c) => {
  if(!publicKey) throw new HTTPException(425);

  return c.text(publicKey)
})
app.get('/feed', (c) => {
  return c.text('Hello Hono!')
})
app.get('/message-intent', (c) => {
  return c.html(
    <form method="post" action="/private/send-message">
      <input type="text" name="recipient" />
      <textarea name="message">

      </textarea>
      <button type="submit">
        Send
      </button>
    </form>
  )
})

app.post('/private/send-message',async (c)=>{
  const body = await c.req.parseBody()

  assert(typeof body.message == "string")
  assert(typeof body.recipient == "string")
  assert(body.message.length <= 256)

  const signature = generateDigitalSignature(body.message);
  const sender = Bun.env.HOST || ""
  const res = await fetch(body.recipient+"/private-inbox",{
    method:"post",
    headers: {
      "DAB-Sender": sender,
      "DAB-Signature": signature,
      "Content-Type":"text/plain"
    },
    body: body.message
  })
  if(res.ok) return c.text("OK",200)
  return c.text("NOT SENT",500)
})

app.post('/private-inbox',async (c) => {
  const bodyBuffer = await c.req.arrayBuffer()
  const messageBody = Buffer.from(bodyBuffer).toString()
  const signature = c.req.header("DAB-Signature") 
  const sender = c.req.header("DAB-Sender")

  console.log({signature,sender})

  assert(typeof signature == "string",new HTTPException(400))
  assert(typeof sender == "string",new HTTPException(400))

  const externalPublicKey = await (await fetch(sender+"/public-key.pem")).text()
  const isValidMessage = validateDigitalSignature(messageBody,signature,externalPublicKey)

  assert(isValidMessage,new HTTPException(403))

  console.log("Received: ", messageBody, "from", sender)
  return c.text('OK RECEIVED')
})

export default app
