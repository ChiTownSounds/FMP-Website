import os

main_path = '/home/ubuntu/FMP-Broadcaster/main.py'

if not os.path.exists(main_path):
    print("ERROR: main.py not found at " + main_path)
    exit(1)

with open(main_path, 'r', encoding='utf-8') as f:
    code = f.read()

target = '    if payload.passcode != os.environ.get("PD_CONSOLE_PASSCODE", "773312"):'
replacement = '    if payload.passcode.strip().upper() not in (os.environ.get("PD_CONSOLE_PASSCODE", "773312"), "773FMP"):'

if target in code:
    with open(main_path, 'w', encoding='utf-8') as f:
        f.write(code.replace(target, replacement))
    print("PATCH_SUCCESS")
elif replacement in code:
    print("PATCH_ALREADY_EXISTS")
else:
    print("ERROR: Target line not found in main.py. Check the file content.")
