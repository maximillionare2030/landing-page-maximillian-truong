import { Octokit } from "octokit";

// Handle repo name collisions by appending -1, -2, etc.
function handleRepoCollision(baseName: string, existingNames: string[]): string {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  let counter = 1;
  let candidate = `${baseName}-${counter}`;
  while (existingNames.includes(candidate)) {
    counter++;
    candidate = `${baseName}-${counter}`;
  }
  return candidate;
}

export interface CreateRepoOptions {
  name: string;
  owner: string;
  private?: boolean;
  description?: string;
}

export interface CreateRepoResult {
  success: boolean;
  repoName: string;
  repoUrl?: string;
  error?: string;
}

/**
 * Create a GitHub repository using Octokit
 */
export async function createGitHubRepo(
  token: string,
  options: CreateRepoOptions
): Promise<CreateRepoResult> {
  const octokit = new Octokit({ auth: token });

  try {
    // First, check existing repos to handle collisions
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
    });

    const existingNames = repos.map((repo) => repo.name);
    const finalName = handleRepoCollision(options.name, existingNames);

    // Create the repository
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
      name: finalName,
      private: options.private ?? false,
      description: options.description || "Personal landing page",
      auto_init: false,
    });

    return {
      success: true,
      repoName: finalName,
      repoUrl: repo.html_url,
    };
  } catch (error: any) {
    if (error.status === 422 && error.message?.includes("already exists")) {
      // Handle collision by appending number
      const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
      });
      const existingNames = repos.map((repo) => repo.name);
      const finalName = handleRepoCollision(options.name, existingNames);

      try {
        const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
          name: finalName,
          private: options.private ?? false,
          description: options.description || "Personal landing page",
          auto_init: false,
        });

        return {
          success: true,
          repoName: finalName,
          repoUrl: repo.html_url,
        };
      } catch (retryError: any) {
        return {
          success: false,
          repoName: options.name,
          error: retryError.message || "Failed to create repository",
        };
      }
    }

    return {
      success: false,
      repoName: options.name,
      error: error.message || "Failed to create repository",
    };
  }
}

/**
 * Get repository URL for setting remote
 */
export function getRepoUrl(owner: string, repoName: string): string {
  return `https://github.com/${owner}/${repoName}.git`;
}

