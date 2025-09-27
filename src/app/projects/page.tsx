"use client";

import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  MoreVertical, 
  Edit, 
  Trash2,
  FolderOpen,
  Calendar,
  Code2,
  ArrowLeft,
  Plus
} from "lucide-react";

export default function ProjectsPage() {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//   const deleteProjectMutation = useMutation({
//     mutationFn: (projectId: string) => trpc.projects.delete.mutate({ id: projectId }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['projects'] });
//       setActiveDropdown(null);
//     },
//   });

//   if (!user) return null;

//   const handleDelete = async (projectId: string, projectName: string) => {
//     if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
//       await deleteProjectMutation.mutateAsync(projectId);
//     }
//   };

//   const handleEdit = (projectId: string) => {
//     router.push(`/projects/${projectId}/edit`);
//   };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header with Back Button and Create New */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <FolderOpen className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  All Projects
                </h1>
                <p className="text-muted-foreground mt-1 text-md">
                  {projects?.length || 0} {(projects?.length || 0) === 1 ? 'project' : 'projects'} • <span className="text-primary font-semibold">e2b</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Create New Project Button */}
          {/* <button
            onClick={() => router.push('/projects/new')}
            className="group relative bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button> */}
        </div>

        {/* Projects Grid */}
        <div className="bg-background/95 backdrop-blur-sm border border-primary/15 rounded-3xl shadow-xl shadow-primary/10 p-8">
          {projects?.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center">
                <Code2 className="w-12 h-12 text-muted-foreground/60" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No projects yet
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-lg mb-8">
                Start building amazing Next.js applications with AI assistance. 
                Your projects will appear here once created.
              </p>
              <button
                onClick={() => router.push('/projects/new')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects?.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-background border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-black/5 hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  {/* Dropdown Menu */}
                  <div className="absolute top-5 right-5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === project.id ? null : project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2.5 hover:bg-muted rounded-xl transition-all duration-200"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    
                    {activeDropdown === project.id && (
                      <div className="absolute right-0 top-full mt-2 w-44 bg-background rounded-xl shadow-xl border border-border z-20 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleEdit(project.id);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted flex items-center gap-3 text-foreground transition-colors duration-150"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Project
                        </button>
                        <div className="h-px bg-border" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleDelete(project.id, project.name);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 hover:text-red-600 flex items-center gap-3 text-muted-foreground transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Project
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Project Card Content */}
                  <div
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="h-full flex flex-col"
                  >
                    {/* Project Info */}
                    <div className="flex-1 space-y-3 mb-6">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        No description created yet
                      </p>
                    </div>

                    {/* Project Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {formatDistanceToNow(new Date(project.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs font-medium text-muted-foreground">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
