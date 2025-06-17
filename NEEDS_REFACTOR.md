# Refactoring Needed for Instagram Bot Implementation

## Critical Issue: Template Selection Logic

### Problem
The current implementation attempts to:
1. Match templates based on keyword presence in template content
2. Treats the template dictionary as a list of tuples
3. Lacks explicit relationship between triggers and templates

This results in:
- Runtime errors (`TypeError` on integer indexing)
- Potential incorrect template selection
- No way to specify which template should be used for which trigger

### Required Changes
1. **Database Schema Update**:
   - Add `template_id` foreign key to `triggers` table
   - Remove keyword matching from template selection

2. **Bot Logic Update**:
```python
# Fetch triggers with template IDs
self.db_cursor.execute("""
    SELECT t.id, t.post_id, t.keyword, t.template_id 
    FROM triggers t
    WHERE t.is_active = TRUE
""")

# In the main loop:
for trigger in triggers:
    template_id = trigger[3]  # 4th element is template_id
    if template_id in templates_dict:
        template = templates_dict[template_id]
        # Send DM using this template
```

3. **Template Handling**:
   - Maintain current templates dictionary
   - Select templates by direct ID lookup instead of content matching

### Additional Recommendations
- Add validation to ensure template IDs in triggers exist
- Implement error handling for missing templates
- Update documentation to reflect new trigger-template relationship
