# WebStack

## Setup

### Secrets

There is a `secrets.ts.template` file, you should copy this file as `secrets.ts` and then never
commit it to git.

### Local setup

Install `Vagrant`, download at https://www.vagrantup.com/downloads.html
Install `VirtualBox`, download at https://www.virtualbox.org/wiki/Downloads

Clone the repo:

    git clone git@github.com:Nthalk/stack-light.git
    cd stack-light

Initialize the virtual machine:

    ./vm up

Run scripts to setup the machine:

    ./vm exec ./setup

### Cloud9 setup

First you'll need an `AWS Account` at https://console.aws.amazon.com/console

Then you will need an `IAM Account` (https://console.aws.amazon.com/iam/home?#/users) for every user that will have an `Cloud9 IDE` that is assigned a group with the `Cloud9User` and `Cloud9Admin` permissions (https://console.aws.amazon.com/iam/home?#/groups).

Next, login to your account (you can find the sign on url on the user's `Security Credentials` tab).

The next setup step is to create the `Environment IDE` at https://console.aws.amazon.com/cloud9/home/create

When your machine is created and setup, you should your use `Github` account:

    ssh-keygen
    # Copy the output of the following command
    cat ~/.ssh/id_rsa.pub

Then enter this key into your `Github ssh keys` at https://github.com/settings/ssh/new

Next, clone this repo in your shell tab in your `Cloud9 IDE`.

    cd ~/
    rm -rf environment
    git clone git@github.com:Nthalk/stack-light.git environment

And run the provisioning script to ensure that the database is installed and running, the system is
up to date, and that the applications can build.

    cd environment
    ./setup

## Development

### Reset/Initialize database

    # Cloud9
    ./db-reset

    # Local
    ./vm exec ./db-reset

### Migrate

    ./db-migrate

### Regen

    ./db-regen

### Run servers

    ./run-server
    ./run-web

The server should be runninng at http://localhost:8080, and http://localhost:8081

8081 is the raw server, and 8080 is the webpack dev server, that live-updates in dev mode.

You should do your testing locally on the 8080 server.

# Configure Authentication

## Google OAuth

There should be a registered Google API's project, and credentials should be created:

    https://console.developers.google.com/apis/credentials

You must have a valid `OAuth Client ID`.
This client id must have an `Authorized JavaScript origin` of `http://localhost:8080`.
This client id must have an `Authorized redirect URI` of `http://localhost:8080/auth/google/callback`.

    // File: ./secrets.ts
    export default {
        googleKey: "YOUR Client ID HERE",
        googleSecret: "YOUR Client Secret HERE"
    };

# TODO

- [x] React client, live-reload
- [x] Express webservice, live-reload
- [x] Cloud9 IDE /environment
- [x] DB Reset
- [x] DB Migrations: https://github.com/thomwright/postgres-migrations
- [x] DB Schema: https://github.com/SweetIQ/schemats
- [x] Generated Rest Api Client
- [ ] Users/Authentication: (passport) http://www.passportjs.org/
- [ ] More workers: https://nodejs.org/api/cluster.html
- [ ] Job Queue: https://github.com/Automattic/kue
- [ ] SMS client: (twilio) https://www.twilio.com/docs/libraries/node
- [ ] Email: (Sendgrid) https://sendgrid.com/docs/for-developers/sending-email/v3-nodejs-code-example/
- [ ] Payments: (stripe) https://github.com/stripe/stripe-node
