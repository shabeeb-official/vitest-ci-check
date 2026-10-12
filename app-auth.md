### Introduction

This document outlines how to authenticate react app using a cloud run function.
The idea is to create a new cloud run function for creating a JWT token, this
function takes in a `tenant_id` which can either be passed from the front-end or
created from the back-end. By using this `tenant_id` the authentication service
will create a token and return it. The token will have a short expiry time, the
refresh of the token will be handled entirely from the front-end. After the
authentication is done the subsequent requests to PLP and PDP will carry this
token in the `Authentication` header as a `Bearer <token>` and the called
service will handle if the token is valid or not.

### Implementation

## Authentication Service

The authentication service will be hosted as a cloud run function that will
generate the JWT token and return the token to the front-end. The token will be
created with a RS256 algorithm which uses asymmetric cryptography, which will
have a private key and public key. The public key will be shared to the other
services and the private key will be used to create the JWT token this approach
is chosen because of the better security provided by RS256 algorithm. Example to
create the keys is given below, please note that this approach uses openssl
better approach can be chosen:

```zsh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Running the about command will give two files:

    - private.pem: Keep this secret don't share
    - public.pem : Shared to other cloudrun services

```js
import jwt from "jsonwebtoken";

const secret = process.env.PRIVATE_KEY;

export function issueToken(user) {
  return jwt.sign({ tenant_id: "", iss: "", exp: "30min" }, secret, {
    expiresIn: "30min",
  });
}
```

## App Authentication

The loader file will call the authentication service from the host website this
is required for the origin to match otherwise the authentication will fail. The
loader will call the authentication service and get the token then save it in
`localStorage` for the react app to access for the subsequent requests. The
authentication needs to be completed before the app is loaded, if the
authentication is not successful the app needs not be loaded.The loader file
also handles the refreshing of the token

## Verification of Token

The verification of the token will be handled by the cloud run functions called
from the front-end, ie: PLP or PDP. These services will have the public key
created earlier and use that to validate the token received.

```js
import jwt from "jsonwebtoken";

const secret = process.env.PUBLIC_KEY;

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
```
