#!/usr/bin/env bash
# Dump `wrkq --help` and every top-level subcommand's help into content/help/.
# Every command shown on wrkq.sh must trace back to a file in this directory.
set -euo pipefail
cd "$(dirname "$0")/.."
out=content/help
mkdir -p "$out"
wrkq --help > "$out/wrkq.txt" 2>&1 || true
wrkq version > "$out/version.txt" 2>&1 || true
for cmd in $(wrkq --help 2>&1 | awk '/^Commands:/{f=1;next} /^Flags:/{f=0} f{for(i=1;i<=NF;i++) print $i}'); do
  wrkq "$cmd" --help > "$out/wrkq-$cmd.txt" 2>&1 || true
  # one level of nested subcommands
  for sub in $(wrkq "$cmd" --help 2>&1 | awk '/^Commands:/{f=1;next} /^(Flags|Global Flags):/{f=0} f && NF{print $1}'); do
    wrkq "$cmd" "$sub" --help > "$out/wrkq-$cmd-$sub.txt" 2>&1 || true
  done
done
wrkf --help > "$out/wrkf.txt" 2>&1 || true
wrkqadm --help > "$out/wrkqadm.txt" 2>&1 || true
wrkqd --help > "$out/wrkqd.txt" 2>&1 || true
ls "$out" | wc -l
