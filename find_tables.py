import re
tables = set()
with open("export_for_live.sql", "r", encoding="utf-8") as f:
    for line in f:
        match = re.search(r"INSERT INTO `([a-z_]+)`", line)
        if match:
            tables.add(match.group(1))
print(tables)
