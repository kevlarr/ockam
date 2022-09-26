import * as Ockam from "."

export * from "./worker";
export * from "./routing";
export * from "./node";

function logMessage(context: Ockam.Context, message: Ockam.Message) {
  console.log(context.address, " - received - ", message)
}

export class Hop implements Ockam.Worker {
  handleMessage(context: Ockam.Context, message: Ockam.Message) {
    logMessage(context, message)

    // remove my address from beginning of onwardRoute
    message.onwardRoute.shift();
    // add my own address to beginning of returnRoute
    message.returnRoute.unshift(context.address);
    context.route(message)
  }
}

export class Printer implements Ockam.Worker {
  handleMessage(context: Ockam.Context, message: Ockam.Message) {
    logMessage(context, message)
  }
}

export class Echoer implements Ockam.Worker {
  handleMessage(context: Ockam.Context, message: Ockam.Message) {
    logMessage(context, message)

    // make returnRoute of incoming message, onwardRoute of outgoing message
    message.onwardRoute = message.returnRoute;
    // make my address the the returnRoute of the new message
    message.returnRoute = [context.address]
    context.route(message)
  }
}

export function example1() {
  let node = new Ockam.Node()
  node.startWorker("printer", new Printer())

  // TODO: Should the `returnRoute` be populated automatically,
  // as in Rust implementation?
  node.route({
    onwardRoute: ["printer"],
    returnRoute: [],
    payload: "hello",
  })
}

export function example2() {
  let node = new Ockam.Node()

  node.startWorker("printer", new Printer())
  node.startWorker("h1", new Hop())
  node.startWorker("h2", new Hop())
  node.startWorker("h3", new Hop())

  node.route({
    onwardRoute: ["h1", "h2", "h3", "printer"],
    returnRoute: [],
    payload: "hello",
  })
}

export function example3() {
  let node = new Ockam.Node()

  node.startWorker("echoer", new Echoer())
  node.startWorker("h1", new Hop())
  node.startWorker("h2", new Hop())
  node.startWorker("h3", new Hop())

  node.startWorker("app", (context: Ockam.Context, message: Ockam.Message) => {
    logMessage(context, message)
  })

  node.route({
    onwardRoute: ["h1", "h2", "h3", "echoer"],
    returnRoute: ["app"],
    payload: "hello",
  })
}

export function example4Initiator() {
  let node = new Ockam.Node()

  node.startWorker("app", new Printer())
  node.createTcpTransport()

  node.route({
    onwardRoute: [
      (TCP, "localhost:4000"),
      "hopper",
      (TCP, "localhots:4001"),
      "echoer".
    ],
    returnRoute: ["app"],
    payload: "hello",
  })
}

export function example4Hopper() {
  let node = new Ockam.Node()

  node.startWorker("hopper", new Hop())
  node.createTcpTransport().listen("127.0.0.1:4000")
}

export function example4Echoer() {
  let node = new Ockam.Node()

  node.startWorker("echoer", new Echoer())
  node.createTcpTransport().listen("127.0.0.1:4001")
}
