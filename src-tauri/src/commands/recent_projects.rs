use rusqlite::{params, Connection, Result as SqliteResult};
use serde::{Deserialize, Serialize};
use tauri::State;

use super::agents::AgentDb;

/// Represents a recent project
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RecentProject {
    pub path: String,
    pub name: String,
    pub last_accessed: String,
    pub access_count: i32,
}

/// Initialize the recent projects table
pub fn init_recent_projects_table(conn: &Connection) -> SqliteResult<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS recent_projects (
            path TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            last_accessed TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            access_count INTEGER NOT NULL DEFAULT 1
        )",
        [],
    )?;
    Ok(())
}

/// Add or update a recent project
#[tauri::command]
pub async fn add_recent_project(
    db: State<'_, AgentDb>,
    path: String,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    
    // Extract project name from path
    let name = std::path::Path::new(&path)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(&path)
        .to_string();
    
    // Try to update existing entry first
    let updated = conn
        .execute(
            "UPDATE recent_projects 
             SET last_accessed = CURRENT_TIMESTAMP, 
                 access_count = access_count + 1 
             WHERE path = ?1",
            params![&path],
        )
        .map_err(|e| e.to_string())?;
    
    // If no rows were updated, insert new entry
    if updated == 0 {
        conn.execute(
            "INSERT INTO recent_projects (path, name) VALUES (?1, ?2)",
            params![&path, &name],
        )
        .map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

/// Get recent projects
#[tauri::command]
pub async fn get_recent_projects(
    db: State<'_, AgentDb>,
    limit: Option<usize>,
) -> Result<Vec<RecentProject>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(10);
    
    let mut stmt = conn
        .prepare(
            "SELECT path, name, last_accessed, access_count 
             FROM recent_projects 
             ORDER BY last_accessed DESC, access_count DESC 
             LIMIT ?1",
        )
        .map_err(|e| e.to_string())?;
    
    let projects = stmt
        .query_map(params![limit], |row| {
            Ok(RecentProject {
                path: row.get(0)?,
                name: row.get(1)?,
                last_accessed: row.get(2)?,
                access_count: row.get(3)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    
    Ok(projects)
}

/// Remove a recent project
#[tauri::command]
pub async fn remove_recent_project(
    db: State<'_, AgentDb>,
    path: String,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    
    conn.execute(
        "DELETE FROM recent_projects WHERE path = ?1",
        params![&path],
    )
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

/// Clear all recent projects
#[tauri::command]
pub async fn clear_recent_projects(
    db: State<'_, AgentDb>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    
    conn.execute("DELETE FROM recent_projects", [])
        .map_err(|e| e.to_string())?;
    
    Ok(())
}