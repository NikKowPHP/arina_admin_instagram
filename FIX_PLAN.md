# Fix Plan: Resolve ModuleNotFoundError in Tests

## Problem
The test file `test_instagram_bot.py` cannot import the `InstagramBot` class due to a package naming mismatch. The setup.py declares the package as "instagram_bot" but the actual directory is named "bot".

## Solution
1. Create a virtual environment
2. Rename the bot directory to instagram_bot
3. Update all import statements to use the new package name
4. Update setup.py to correctly reference the package
5. Reinstall the package in editable mode within the virtual environment
6. Verify tests run successfully

## Steps

### 1. Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Update import statements (directory already renamed)
In `instagram_bot/test_instagram_bot.py`:
```python
from instagram_bot.instagram_bot import InstagramBot
```

In `instagram_bot/instagram_bot.py` (if there are internal imports):
```python
# No internal imports need changing
```

### 4. Update setup.py
```python
setup(
    name="instagram_bot",
    version="0.1",
    packages=find_packages(),
    # ... rest remains the same
)
```

### 5. Reinstall the package
```bash
pip uninstall instagram_bot
pip install -e .
```

### 5. Run tests
```bash
venv/bin/python instagram_bot/test_instagram_bot.py
```
```bash
python instagram_bot/test_instagram_bot.py
```

## Expected Outcome
- Tests should execute without ModuleNotFoundError
- Package imports should resolve correctly