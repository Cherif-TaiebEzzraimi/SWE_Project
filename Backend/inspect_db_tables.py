import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name('db.sqlite3')

con = sqlite3.connect(DB_PATH)
cur = con.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in cur.fetchall()]
print(f"DB: {DB_PATH}")
print(f"Tables ({len(tables)}):")
for name in tables:
    print(name)

print("\nRow counts (if table exists):")
for name in [
    'projects',
    'project_phases',
    'deliverables',
    'platform_api_project',
    'platform_api_projectphase',
    'platform_api_deliverable',
]:
    if name not in tables:
        continue
    cur.execute(f"SELECT COUNT(*) FROM {name}")
    print(f"- {name}: {cur.fetchone()[0]}")
