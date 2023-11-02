class HelloWorld {
  constructor(private message: string) {}

  greet() {
    console.log(this.message);
  }
}

const greeter = new HelloWorld(process.env.GREETING || "");
greeter.greet();
