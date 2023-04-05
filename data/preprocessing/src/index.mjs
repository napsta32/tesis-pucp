#!/usr/bin/env zx
import 'zx/globals';

async function main() {
    const files = $`ls`;
    echo(files);
}

main();
