import { serve } from "https://deno.land/std@0.149.0/http/server.ts";

async function handleRequest() {
  const response = await fetch(
    "https://www.minecraft.net/en-us/download/server/bedrock",
  );
  const body = await response.text();
  const regx =
    /https:\/\/minecraft\.azureedge\.net\/bin-linux\/bedrock-server-([\d\.)]+).zip/;
  const [url, version] = body.match(regx) ?? [];
  const name = `bedrock-server-${version}.zip`;

  return new Response(`#!/bin/sh
# Copyright justjavac. All rights reserved. MIT license.
# https://github.com/justjavac/deno_deploy_minecraft_bedrock
# 
# curl -fsSL https://bedrock.deno.dev | sh
#

set -e

if ! command -v unzip >/dev/null; then
    echo "Error: unzip is required to install Minecraft." 1>&2
    exit 1
fi

curl --fail --location --progress-bar --output ${name} ${url}
unzip -d ./bedrock -o ${name}
chmod +x ./bedrock/bedrock_server
# rm ${name}
echo "cd \`pwd\`/bedrock" > start.sh
echo 'LD_LIBRARY_PATH=. ./bedrock_server' >> start.sh
chmod +x ./start.sh

echo "Minecraft was installed successfully."
echo "  Run './start.sh' to get started."
`);
}

serve(handleRequest);
