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

    def test_database_service(self):
        """Test that the database service is running."""
        # This is a simple test to check if the database is accepting connections
        result = subprocess.run(
            ["docker", "exec", "db", "pg_isready"],
            capture_output=True,
            text=True
        )
        self.assertIn("accepting connections", result.stdout)

    # ROO-AUDIT-TAG :: plan-003-database-verification.md :: Data consistency
    def test_data_consistency(self):
        """Verify critical data relationships and constraints."""
        # Check foreign key relationships
        # Example: Verify all triggers have valid template IDs
        result = subprocess.run(
            ["docker", "exec", "db", "psql", "-U", "postgres", "-d", "main", "-c",
             "SELECT COUNT(*) FROM triggers WHERE template_id NOT IN (SELECT id FROM templates)"],
            capture_output=True,
            text=True
        )
        orphaned_triggers = int(result.stdout.splitlines()[-2])
        self.assertEqual(orphaned_triggers, 0, f"Found {orphaned_triggers} triggers with invalid template IDs")

        # Check required fields
        result = subprocess.run(
            ["docker", "exec", "db", "psql", "-U", "postgres", "-d", "main", "-c",
             "SELECT COUNT(*) FROM triggers WHERE name IS NULL"],
            capture_output=True,
            text=True
        )
        null_names = int(result.stdout.splitlines()[-2])
        self.assertEqual(null_names, 0, f"Found {null_names} triggers with null names")

    def test_critical_data_relationships(self):
        """Verify integrity of critical data relationships."""
        # Test cascade delete from templates to triggers
        # 1. Create test template and associated trigger
        subprocess.run(
            ["docker", "exec", "db", "psql", "-U", "postgres", "-d", "main", "-c",
             "INSERT INTO templates (id, content) VALUES ('test_template', 'Test content')"],
            capture_output=True,
            text=True
        )
        subprocess.run(
            ["docker", "exec", "db", "psql", "-U", "postgres", "-d", "main", "-c",
             "INSERT INTO triggers (id, name, template_id) VALUES ('test_trigger', 'Test Trigger', 'test_template')"],
            capture_output=True,
            text=True
        )
        
        # 2. Delete the template and verify trigger is handled appropriately
        subprocess.run(
            ["docker", "exec", "db", "psql", "-U", "postgres", "-d", "main", "-c",
             "DELETE FROM templates WHERE id = 'test_template'"],
            capture_output=True,
            text=True
        )
        
        # 3. Check if trigger was cascade deleted or nullified
        result = subprocess.run(
            ["docker", "exec", "db", "psql", "-U", "postgres", "-d", "main", "-c",
             "SELECT COUNT(*) FROM triggers WHERE id = 'test_trigger'"],
            capture_output=True,
            text=True
        )
        remaining_triggers = int(result.stdout.splitlines()[-2])
        self.assertEqual(remaining_triggers, 0, "Trigger not properly handled after template deletion")

if __name__ == "__main__":
    unittest.main()