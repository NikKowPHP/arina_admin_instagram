from setuptools import setup, find_packages

setup(
    name="instagram_bot",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "instagrapi",
        "python-dotenv",
        "psycopg2-binary",
        "requests",
        "pillow>=8.1.1"
    ],
)