# Refactor: Instagram Bot Template Selection

## Objectives
1. Update database schema to add `template_id` foreign key to `triggers` table
2. Modify bot logic to use template IDs instead of keyword matching
3. Update template handling to use direct ID lookup
4. Add validation and error handling
5. Update tests to reflect new functionality

## Steps

### 1. Database Schema Update
- Add `template_id` column to `triggers` table in Prisma schema
- Generate migration

### 2. Bot Logic Update
- Modify trigger query to include template_id
- Replace keyword matching with direct template ID lookup
- Add error handling for missing templates

### 3. Template Handling
- Maintain templates dictionary with ID keys
- Remove unused keyword matching logic

### 4. Validation
- Add check to ensure template IDs exist before sending DMs
- Implement error logging for missing templates

## Implementation Plan
```prisma
// Add to Trigger model in admin/admin/prisma/schema.prisma
template_id Int?
template    Template? @relation(fields: [template_id], references: [id])
```

```python
# instagram_bot.py updates
# In trigger fetching:
self.db_cursor.execute("""
    SELECT t.id, t.post_id, t.keyword, t.template_id 
    FROM triggers t
    WHERE t.is_active = TRUE
""")

# In main loop:
for trigger in triggers:
    template_id = trigger[3]
    if template_id and template_id in templates_dict:
        template = templates_dict[template_id]
        # Send DM
    else:
        logger.error(f"Template not found for trigger ID: {trigger[0]}")
```

