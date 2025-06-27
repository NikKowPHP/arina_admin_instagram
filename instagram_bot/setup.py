from setuptools import setup, find_packages

setup(
    name="instagram_bot",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "instagrapi==1.3.2",
        "python-dotenv==1.0.0",
        "psycopg2-binary==2.9.6",
        "requests==2.24.0",
        "pytest==7.4.0",
        "pytest-mock==3.10.0",
        "pytest-cov==4.0.0",
        "pytz==2020.1",
        "moviepy==1.0.3",
        "Pillow==7.2.0",
        "pydantic==1.7.2",
    ],
    entry_points={
        "console_scripts": [
            "instagram_bot=instagram_bot.instagram_bot:main",
        ],
    },
)