import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  d1: [
    {
      binding: "DB",
      database_id: "613ff7ac-1b34-4139-9935-8784867f3295",
    },
  ],
});
