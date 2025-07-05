import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Folder, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, type RecentProject } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface RecentProjectsListProps {
  /**
   * Callback when a project is selected
   */
  onSelect: (path: string) => void;
  /**
   * Optional className for styling
   */
  className?: string;
}

export const RecentProjectsList: React.FC<RecentProjectsListProps> = ({
  onSelect,
  className,
}) => {
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingPaths, setRemovingPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    try {
      setLoading(true);
      const recentProjects = await api.getRecentProjects(5);
      setProjects(recentProjects);
    } catch (error) {
      console.error("Failed to load recent projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    setRemovingPaths(prev => new Set(prev).add(path));
    
    try {
      await api.removeRecentProject(path);
      setProjects(prev => prev.filter(p => p.path !== path));
    } catch (error) {
      console.error("Failed to remove recent project:", error);
    } finally {
      setRemovingPaths(prev => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Clock className="h-4 w-4" />
        <span>Recent Projects</span>
      </div>
      
      <AnimatePresence>
        {projects.map((project, index) => (
          <motion.div
            key={project.path}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
          >
            <button
              onClick={() => onSelect(project.path)}
              className="w-full text-left px-3 py-2 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all duration-200 flex items-center gap-3"
              disabled={removingPaths.has(project.path)}
            >
              <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {project.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {project.path}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(project.last_accessed), { addSuffix: true })}
                  {project.access_count > 1 && (
                    <span className="ml-2">• Used {project.access_count} times</span>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemove(e, project.path)}
                disabled={removingPaths.has(project.path)}
              >
                {removingPaths.has(project.path) ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </Button>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};