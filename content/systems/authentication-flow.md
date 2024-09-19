# Authentication Flow

Here's a flowchart describing the authentication process:

```mermaid
flowchart TD
  A[Start]-->B{Check Session}
  B-->|Session Exists|C[Validate]
  B-->|No Session|D[Login/Signup]
  C-->|Valid|E[Logged In]
  C-->|Invalid|D
  D-->F[Enter Credentials]
  F-->G[Authenticate]
  G-->|Success|H[Create Session]
  G-->|Failure|I[Error]
  H-->E
  E-->J[User Action]
  J-->|Logout|K[Clear Session]
  J-->|Continue|E
  K-->D
  ```