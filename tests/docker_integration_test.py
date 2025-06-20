import subprocess
import time
import unittest
import requests

class DockerIntegrationTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Start the Docker containers before the tests run."""
        print("Starting Docker containers...")
        result = subprocess.run(
            ["docker-compose", "up", "--build", "-d"],
            capture_output=True,
            text=True
        )
        print(result.stdout)
        print(result.stderr)

        # Give the services time to start
        time.sleep(60)

    @classmethod
    def tearDownClass(cls):
        """Stop the Docker containers after the tests run."""
        print("Stopping Docker containers...")
        subprocess.run(["docker-compose", "down"], capture_output=True, text=True)

    def test_admin_panel_service(self):
        """Test that the admin panel service is running and accessible."""
        response = requests.get("http://localhost:3000")
        self.assertEqual(response.status_code, 200)
        self.assertIn("text/html", response.headers["Content-Type"])

    def test_bot_service_service(self):
        """Test that the bot service is running and healthy."""
        # This assumes the bot service has a healthcheck endpoint
        response = requests.get("http://localhost:8000/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_database_service(self):
        """Test that the database service is running."""
        # This is a simple test to check if the database is accepting connections
        result = subprocess.run(
            ["docker", "exec", "db", "pg_isready"],
            capture_output=True,
            text=True
        )
        self.assertIn("accepting connections", result.stdout)

if __name__ == "__main__":
    unittest.main()