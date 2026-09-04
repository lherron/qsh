/**
 * The first 17 lines of real `wrkq info` output — the whole "Task Lifecycle"
 * section, verbatim.
 *
 * Produced by running `wrkq info` (an alias of `wrkq usage`; see
 * content/help/wrkq-usage.txt), which emits a JSON envelope in an agent
 * runtime, then taking the human text out of its `content` field:
 *
 *   wrkq info | python3 -c "import json,sys; print(json.load(sys.stdin)['content'])" | sed -n '1,17p'
 *
 * Not paraphrased and not reflowed. Re-run the command above to refresh it.
 */
export const WRKQ_INFO = `<task_tracking_rules>
# wrkq Task Management CLI

## Task Lifecycle
1. **Before starting a task**: Set task to \`in_progress\`
   wrkq set T-00001 --state in_progress

2. **During work on a task**: Add progress comments for significant milestones
   wrkq comment add T-00001 -m "Implemented core logic in cmd/apply.go"
   wrkq comment add T-00001 -m "Added test coverage, 3 edge cases found"
   wrkq comment add T-00001 -m - <<'EOF'
   Multi-line progress note from stdin.
   EOF

3. **Before completing a task**: Add final summary comment
   wrkq comment add T-00001 -m "Completed. Added apply cmd with 3-way merge support. Updated docs. All tests passing."
   wrkq set T-00001 --state completed`;
