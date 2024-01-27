  // Project Filters
  export const getRecentProjects = (projects, limit) => {
    console.log(projects);
    return projects.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  };
  export const getProjectsByStatus = (projects, status) => {
    return projects.filter(project => project.status === status);
  };