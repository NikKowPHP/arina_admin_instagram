# Refactor Needed: Missing Pillow Dependency

The test suite fails because the Pillow module is not installed. The instagrapi dependency requires Pillow, but it is not included in the requirements.txt.

Steps to fix:
1. Add 'Pillow>=8.1.1' to instagram_bot/requirements.txt
2. Re-run the tests to verify

