# AskThem
Ask them is a project developed by Joey Lieb, the purpose of this project is to ask anonymous questions to people with certain ideologies.
The website is grouped in 2 categories:
- Questioners:
  - These users can sign up easily, and instantly get their "inbox" launched.
  - They will be able to send messages to answerers of their choosing, filtered by rating, etc.
  - Their user is purely random and is based off their UID (a number assigned based on when they signed up)
- Answerers:
  - These are more premium users who sign up purely to answer questions
  - An answerer can additionally be a questioner and switching between the inboxes is seamless
  - When signing up, they must go through an onboarding process to determine their political ideology, which will just be self-declared
  - They will recieve questions in their inbox.
    - Answerers do **NOT** have to answer every question and can, to their choosing, delete or ignore questions

Users are expected to sign in with a security key which uses Webauthn protocols via cryptography public key and private key handshakes
- This ensures complete privacy, everything is linked to this security key which can be stored anywhere

We do not store emails, usernames, passwords in the databases, rather just public keys, meaning anonymity is kept at utmost importance. *This goes both ways for questioners and answerers*

# Project Structure
## /discord-bot
### Purpose

This is the discord bot directory and it handles all communication related to discord, for users wanting to reside on that application instead of interfacing the website
### Features

- Sign up your discord server to the website allowing you to interface it without any sign up directly
- Blacklist certain users from using the discord server to send messages via that inbox
- Route all emails to the discord server to certain channels
- Each user in the discord server is given a unique identifier alongside the server address (all of which is not linkable to server or user)
  - This may look like `f3fh038s82@$discord-4324286`to an answerer, rather just `user-38268` if it's a native account

*Anonymity cannot be guarenteed with a discord setup as discord is not an anonymous platform, the point of this feature is larger reach.*

*You cannot sign up to be a answerer on discord as anonymity is of upmost importance in this category.*

## /webserver
### Purpose

This is the webserver directory and it contains all of the next.js components which host the front end and back end of the website

This project uses the Next.JS server backend to handle all API requests

## /websocket
### Purpose

This websocket is primarily used for live component communication between the database and the front end.

### Features

- When users sign up they will be able to view their current live UID as they sign up
  - This means as people sign up while they do, the UID will update to show what they will get if they pressed the sign up button at that moment

# TODO

- [X] Codebase setup
- [X] Proof of concept works
- [X] All components communicating
- Live Websocket User Count
- Users can sign up
- Passkeys
- Inboxes
- More!!!