# Assistance Needed: ModuleNotFoundError in Test

## Problem
Unable to run `test_instagram_bot.py` due to `ModuleNotFoundError: No module named 'instagram_bot'` despite proper package setup.

## Steps Taken:
1. Created test file `bot/test_instagram_bot.py`
2. Tried multiple import approaches:
   - `from instagram_bot import InstagramBot`
   - `from .instagram_bot import InstagramBot`
   - `from bot.instagram_bot import InstagramBot`
3. Added `__init__.py` in `bot/` to make it a package
4. Created `setup.py` with package configuration
5. Installed package in editable mode with `pip install -e .`
6. Ran tests with various PYTHONPATH configurations

## Error Details:
```
ModuleNotFoundError: No module named 'instagram_bot'
```

## Environment:
- Python 3.12
- Virtual environment activated
- Project structure:
  ```
  .
  ├── bot/
  │   ├── __init__.py
  │   ├── instagram_bot.py
  │   └── test_instagram_bot.py
  └── setup.py
  ```

## Request:
Please help identify why the module isn't being found despite proper package installation and configuration.