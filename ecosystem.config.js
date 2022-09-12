module.exports = {
  apps : [{
    name: "bproxy",
    watch: ["server-build"],
    ignore_watch: ["node_modules", "src/web"],
    watch_options: {
      followSymlinks: false,
    },
    watch_delay: 500,
    interpreter: "node",
    interpreter_args: [],
    script: "./server-build/proxy/bash.js",
    args: "",
    exec_mode: "fork_mode",
    instances: 1,
    cwd: "./",
  }]
}
