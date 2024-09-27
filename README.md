# DAB (Dumb as Bricks) Blogging Protocol

DAB is a federated blogging protocol, designed to be as simple to implement as possible. This draft is the result of a brainstorming session on a balcony in Friedrichshain and therefore represents a very early version of the protocol.

## Lingo
A *Server* in the context of this document is a single-user instance. (It is a misleading name that should be replaced) There are no limits on what the Base URL of such an instance could be. A single user instance could be `bernd.dab-blog.sh` or `dab-example.blog` or `xzy.dab-blog.sh/bla/bli/blub`. It just needs to be a domain-space that the user has full control over and implements the following endpoints:

## API-Spec

### Capabilities

`/capabilities`

Returns a comma seperated list of capabilities the server provides
- PRIVATE_TEXT_MESSAGES
- PRIVATE_IMAGE_MESSAGES
- MESSAGE_INTENT
- FEED_SEARCH
- FEED_PAGINATION

---
### Feed

`/feed`
Should return a HTML document containing published articles

The HTML document should only contain a specific subset of HTML that is yet to be determined. Clients should filter the results to make sure only valid HTML tags are displayed to the user. 

Every article should be enclosed in an `<article data-shared-at="unixtimestamp">` tag. 

#### Query Params
`?query=String` Filter feed by text search
`?since=String` Filter feed by date posted
`?limit=Int&page=Int` Pagination

---
### Private Inbox


`/private-inbox`
#### Headers
`DAB-Sender` Sender (URI)
`DAB-Signature` Verifiable signature (Should be verifiable by querying ${DAB-Sender}/public-key.pem and using the key provided)
`Content-Type` either text/plain, image/png, image/jpeg or image/gif

#### Body
Plain text or image data

---
### Message Intent

`/message-intent`
Should redirect a logged in user to a private message conversation with `?recipient=URI`

The endpoint is intended to enable simple reactions on other websites. A website prompts the user for their Server URI and redirects them with the right query params to enable them to easily react to content.

#### Query Params
`?recipient=URI` The recieving server
`reaction-emoji=EMOJI` Preselect an emoji to send as a reaction to a topic (article)
`topic=URI` Article URI that should be reacted to

---

### Public Key

`/public-key.pem`
Should return the servers public key used to sign private messages

# Setup / Devlog
I created myself a hetzner account
To install kubernetes on my hetzner, I setup rancher by following this terraform code (https://github.com/rancher/quickstart)
I used the hcloud directory, but had to change a few things:
    In the terraform.tfvars:
        hcloud_token = (my hetzner cloud api token)
        instance_type = "cx22"
        hcloud_location = "fsn1"
    infra.tf
        # HCloud Instance for creating a single node RKE cluster and installing the Rancher server
        resource "hcloud_server" "rancher_server" {
        name        = "${var.prefix}-rancher-server"
        image       = "ubuntu-24.04"
after that running terrafrom set me up with a rancher instance super easily.

Now I have my kuberenets cluster running and the next step is to figure out the ci/cd pipeline to deploy to it.
First step is building an image and hosting it in a registry.
I had issues building the docker image. Used the docker template from https://bun.sh/guides/ecosystem/docker.
The default github token does not have permissions to push to registry. I will need to create a new token and set it in the projects settings, for that I'm lacking permissions.