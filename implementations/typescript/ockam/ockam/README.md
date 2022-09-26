# Ockam Typescript

**IMPORTANT:** This implementation is in prototype phase.


## Setup

### Building

To run example functions, first build the project:

```
$ yarn build
```

### Running

Once the project is built, an example can be run manually via `node`
by importing the package and calling the example function.

```
$ node

> let mod
> import('./lib/index.js').then(m => mod = m)
> mod.example1()
undefined
printer  - received -  { onwardRoute: [ 'printer' ], returnRoute: [], payload: 'hello' }
```

## Example 1 - Node

Lorem ipsum.

## Example 2 - Workers

Lorem ipsum.

## Example 3 - Echoer

Lorem ipsum.

## Example 4 - TCP Transport

This example is the first to use multiple nodes,
which all need to be run in a separate `node` process.

Given the instructions above for [importing the package in node](#running),
you will need to run each example function in a separate process using the
provide "`node` command" below.

| Node | Description | `node` command |
|-|-|-|
| Initiator | The Node that sends the initial message | mod.example4.initiator() |
| Hopper | The Node that passes the message through to the next | mod.example4.hopper() |
| Printer | The Node that ultimately handles the message | mod.example4.printer() |

**Note:** The Hopper and Printer processes **MUST BE** started prior to running the Initiator.

## Example 5 - Vault

Lorem ipsum.
