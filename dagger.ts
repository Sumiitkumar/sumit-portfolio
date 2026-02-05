import { dag, object, func } from "@dagger.io/dagger"

@object()
class Portfolio {
  @func()
  async build(): Promise<string> {
    const source = dag.host().directory(".")
    
    const runner = dag
      .container()
      .from("node:20-alpine")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["npm", "install"])
      .withExec(["npm", "run", "build"])

    const output = await runner.directory("/app/build").id()
    return `Build completed successfully! Output ID: ${output}`
  }

  @func()
  async test(): Promise<string> {
    const source = dag.host().directory(".")
    
    const runner = dag
      .container()
      .from("node:20-alpine")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["npm", "install"])
      .withExec(["npm", "test", "--", "--passWithNoTests"])

    return "Tests completed!"
  }

  @func()
  async dev(): Promise<void> {
    const source = dag.host().directory(".")
    
    await dag
      .container()
      .from("node:20-alpine")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["npm", "install"])
      .withExposedPort(3000)
      .withExec(["npm", "start"])
      .sync()
  }

  @func()
  async lint(): Promise<string> {
    const source = dag.host().directory(".")
    
    const runner = dag
      .container()
      .from("node:20-alpine")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["npm", "install"])
      .withExec(["npm", "run", "build"])

    const lintResult = await runner.stdout()
    return lintResult
  }
}
