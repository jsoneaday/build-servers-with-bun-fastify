class HelloWorld {
  constructor(private greeting: string) {}
  greet() {
    console.log(this.greeting);
  }
}

const greeter = new HelloWorld("546456");
greeter.greet();
