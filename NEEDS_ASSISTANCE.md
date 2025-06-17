# Assistance Needed: Test Environment Setup Issues

## Problem
Unable to properly set up the test environment due to inconsistent directory state and Python environment issues.

## Steps Taken:
1. Created virtual environment with `python3 -m venv venv`
2. Attempted to rename bot directory to instagram_bot
3. Tried to reinstall package in editable mode
4. Attempted to run tests

## Error Details:
- `mv: cannot stat 'bot': No such file or directory` - suggests the directory was already renamed
- `zsh: command not found: python` - Python 3 might not be aliased as 'python'
- Virtual environment activation may not be persisting between commands

## Request:
Please help investigate the current directory structure and Python environment configuration to resolve the test setup issues.