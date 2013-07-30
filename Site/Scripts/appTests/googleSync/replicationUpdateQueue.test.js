// TODO: Replication Update Queue Tests

module("Replication Update Queue Tests");

amdTest("Enqueue Time 1 record |  Empty Queue | Time 1 Record added ");

amdTest("Enqueue Time 2 record | Time 1 Record in queue already | Time 2 inserted after Time 1");

amdTest("Enqueue Time 3 record | Time 1 and 2 record in queue already | Time 3 inserted after Time 1 and 2");

amdTest("Enqueue Time 2 record | Time 1 and 3 record in queue already | Time 2 inserted between Time 1 and 3");

amdTest("Enqueue Time 1 record | Time 2 and 3 records in queue already | Time 1 inserted before Time 2 and 3");

amdTest("Enqueue Time 2 record | Time 2 in queue already | Noop");

amdTest("Resolve for property p1Test with start of Value A | Value A @ Time 1, Value A @ Time 2, Value A @ Time 3 | Value A wins");
amdTest("Resolve for property p1Test with start of Value A | Value A @ Time 1, Value A @ Time 2, Value B @ Time 3 | Value B wins");
amdTest("Resolve for property p1Test with start of Value A | Value A @ Time 1, Value B @ Time 2, Value A @ Time 3 | Value B wins");
amdTest("Resolve for property p1Test with start of Value A | Value A @ Time 1, Value B @ Time 2, Value C @ Time 3 | Value C wins");
amdTest("Resolve for property p1Test with start of Value A | Value B @ Time 1, Value A @ Time 2, Value A @ Time 3 | Value B wins");
amdTest("Resolve for property p1Test with start of Value A | Value B @ Time 1, Value A @ Time 2, Value C @ Time 3 | Value C wins");
amdTest("Resolve for property p1Test with start of Value A | null    @ Time 1, Value A @ Time 2, Value A @ Time 3 | Value A wins");
amdTest("Resolve for property p1Test with start of null    | null    @ Time 1, Value A @ Time 2, Value A @ Time 3 | Value A wins");
amdTest("Resolve for property p1Test with start of Value A | Value A @ Time 1, null    @ Time 2, Value A @ Time 3 | Value A wins");
amdTest("Resolve for property p1Test with start of Value A | Value A @ Time 1, Value A @ Time 2, null    @ Time 3 | Value A wins");

