# Testing Environment Setup

This guide provides instructions for setting up the testing environment for the Instagram Bot project.

## Virtual Environment Setup

1. Ensure Python 3.10+ is installed on your system.
2. Navigate to the `instagram_bot` directory.
3. Run the setup script:
   ```bash
   chmod +x setup_venv.sh
   ./setup_venv.sh
   ```
4. Activate the virtual environment:
   - macOS/Linux: `source venv/bin/activate`
   - Windows: `.\venv\Scripts\activate`

## Installing Dependencies

1. With the virtual environment activated, install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running Tests

1. To run the test suite, use:
   ```bash
   pytest
   ```
2. For coverage report:
   ```bash
   pytest --cov=instagram_bot
   ```

## Troubleshooting

- If you encounter Python version issues, ensure you have Python 3.10+ installed.
- For PATH issues, make sure to activate the virtual environment before running commands.
- On Windows, use the appropriate path separators and command syntax.

## CI/CD Pipeline

The CI/CD pipeline is configured to:
1. Set up a Python virtual environment
2. Install dependencies
3. Run tests with coverage reporting

See `.github/workflows/tests.yml` for details.