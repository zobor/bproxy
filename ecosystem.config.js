module.exports = {
  apps : [{
    name: "bproxy",
    watch: ["src/proxy"],
    ignore_watch: ["node_modules", "src/web"],
    watch_options: {
      followSymlinks: false,
    },
    watch_delay: 300,
    interpreter: "node",
    interpreter_args: "./node_modules/ts-node/dist/bin.js",
    script: "./src/proxy/shell.ts",
    args: "-s",
    exec_mode: "fork_mode",
    instances: 1,
    cwd: "./",
  }]
}
