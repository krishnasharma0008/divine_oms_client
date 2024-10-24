module.exports = {
  apps: [
    {
      name: "Divine OMS Client ",
      exec_mode: "cluster",
      instances: "max", // Or a number of instances
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
    },
  ],
};
